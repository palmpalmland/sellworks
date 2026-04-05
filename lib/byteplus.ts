import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.ARK_API_KEY,
  baseURL: process.env.ARK_BASE_URL,
});

type ImagePrompt = {
  title: string;
  prompt: string;
};

type VideoPrompt = {
  title: string;
  prompt: string;
  shotPlan?: string;
};

type GeneratedImage = {
  title: string;
  prompt: string;
  b64Json?: string;
  url?: string;
  revisedPrompt?: string;
  error?: string;
};

function extractOutputText(response: any) {
  return (
    response.output_text ||
    response.output
      ?.map((item: any) => {
        if (!item?.content) return "";
        return item.content.map((c: any) => c.text || "").join("");
      })
      .join("\n") ||
    ""
  );
}

function tryParsePromptJson(text: string): ImagePrompt[] | null {
  try {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) return null;

    return parsed
      .filter((item) => item?.title && item?.prompt)
      .map((item) => ({
        title: String(item.title),
        prompt: String(item.prompt),
      }));
  } catch {
    return null;
  }
}

function tryParseVideoPromptJson(text: string): VideoPrompt[] | null {
  try {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) return null;

    return parsed
      .filter((item) => item?.title && item?.prompt)
      .map((item) => ({
        title: String(item.title),
        prompt: String(item.prompt),
        shotPlan: item?.shotPlan ? String(item.shotPlan) : undefined,
      }));
  } catch {
    return null;
  }
}

export async function generateEcommerceCopy(params: {
  title: string;
  description: string;
  platform: string;
  style?: string;
  productUrl?: string;
}) {
  const { title, description, platform, style, productUrl } = params;

  const prompt = `
You are an ecommerce content strategist.

Generate conversion-focused product copy for ${platform}.

Product name: ${title}
Selling points: ${description}
Content style: ${style || "default"}
Product URL: ${productUrl || "not provided"}

Return:
1. A product title
2. 3 selling bullets
3. A short product description

Keep it concise, realistic, and directly usable.
`;

  const response = await client.responses.create({
    model: process.env.ARK_MODEL || "",
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: prompt,
          },
        ],
      },
    ],
  });

  return extractOutputText(response) || "No result returned.";
}

export async function generateImagePrompts(params: {
  title: string;
  sellingPoints: string;
  platform: string;
  style?: string;
  productUrl?: string;
  copy: string;
  referenceImageCount?: number;
  desiredCount?: number;
  imageRequirements?: string[];
}) {
  const {
    title,
    sellingPoints,
    platform,
    style,
    productUrl,
    copy,
    referenceImageCount = 0,
    desiredCount = 2,
    imageRequirements = [],
  } = params;

  const prompt = `
You are an ecommerce creative director.

Create ${desiredCount} image-generation prompts for a product campaign.

Product name: ${title}
Selling points: ${sellingPoints}
Platform: ${platform}
Style: ${style || "default"}
Product URL: ${productUrl || "not provided"}
Reference image count: ${referenceImageCount}
Requested image count: ${desiredCount}
Per-image requirements:
${imageRequirements.map((item, index) => `Image ${index + 1}: ${item || "No extra requirement"}`).join("\n")}

Generated copy:
${copy}

Return ONLY valid JSON as an array like:
[
  { "title": "Hero image", "prompt": "..." },
  { "title": "Lifestyle image", "prompt": "..." }
]

Each prompt should be detailed, visual, ecommerce-friendly, and ready for a text-to-image or image-to-image model.
`;

  const response = await client.responses.create({
    model: process.env.ARK_MODEL || "",
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: prompt,
          },
        ],
      },
    ],
  });

  const text = extractOutputText(response) || "[]";
  const parsed = tryParsePromptJson(text);

  if (parsed && parsed.length > 0) {
    return parsed;
  }

  return [
    {
      title: "Hero image",
      prompt: `Premium ecommerce hero shot for ${title}. Style: ${style || "clean commercial"}. Platform: ${platform}. Selling points: ${sellingPoints}. ${imageRequirements[0] || ""}`.trim(),
    },
    ...(desiredCount > 1
      ? [
          {
            title: "Lifestyle image",
            prompt: `Lifestyle commercial image for ${title}. Platform: ${platform}. Show the product in use and highlight ${sellingPoints}. ${imageRequirements[1] || ""}`.trim(),
          },
        ]
      : []),
  ];
}

export async function generateVideoPrompts(params: {
  title: string;
  sellingPoints: string;
  platform: string;
  style?: string;
  productUrl?: string;
  copy: string;
  imagePrompts: ImagePrompt[];
  referenceVideoCount?: number;
  videoDescription?: string;
  videoDuration?: number;
}) {
  const {
    title,
    sellingPoints,
    platform,
    style,
    productUrl,
    copy,
    imagePrompts,
    referenceVideoCount = 0,
    videoDescription,
    videoDuration = 5,
  } = params;

  const prompt = `
You are an ecommerce video creative strategist.

Create 1 short-form video generation prompt for a product campaign.
The prompt should fit a ${videoDuration}-second video.

Product name: ${title}
Selling points: ${sellingPoints}
Platform: ${platform}
Style: ${style || "default"}
Product URL: ${productUrl || "not provided"}
Reference video count: ${referenceVideoCount}
Optional video description: ${videoDescription || "not provided"}

Generated copy:
${copy}

Image prompts:
${imagePrompts.map((item) => `${item.title}: ${item.prompt}`).join("\n")}

Return ONLY valid JSON as an array like:
[
  {
    "title": "Primary video",
    "prompt": "...",
    "shotPlan": "..."
  }
]

The prompt should be ready for a short-form commercial video model. Keep it visual, concrete, and conversion-focused.
`;

  const response = await client.responses.create({
    model: process.env.ARK_MODEL || "",
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: prompt,
          },
        ],
      },
    ],
  });

  const text = extractOutputText(response) || "[]";
  const parsed = tryParseVideoPromptJson(text);

  if (parsed && parsed.length > 0) {
    return parsed;
  }

  return [
    {
      title: "Primary video",
      prompt: `Create a ${videoDuration}-second short-form commercial video for ${title} on ${platform}. Style: ${style || "performance marketing"}. Focus on ${sellingPoints}. ${videoDescription || ""}`.trim(),
      shotPlan: `Open with a fast product hook, move through the strongest benefit, and close with a CTA within ${videoDuration} seconds.`,
    },
  ];
}

export async function generateImagesFromPrompts(
  prompts: ImagePrompt[],
  options?: { referenceImages?: string[] }
) {
  const imageModel =
    process.env.ARK_IMAGE_MODEL ||
    process.env.ARK_VISUAL_MODEL ||
    process.env.VISUAL_MODEL ||
    "doubao-seedream-4-0-250828";

  if (!imageModel) {
    return {
      status: "pending",
      note: "Image model is not configured on the server yet.",
      images: [] as GeneratedImage[],
    };
  }

  if (!process.env.ARK_API_KEY || !process.env.ARK_BASE_URL) {
    return {
      status: "pending",
      note: "ARK image generation is missing API configuration on the server.",
      images: [] as GeneratedImage[],
    };
  }

  const baseUrl = process.env.ARK_BASE_URL.replace(/\/$/, "");
  const referenceImages = options?.referenceImages?.filter(Boolean) || [];
  const generationMode =
    referenceImages.length > 0 ? "image-to-image" : "text-to-image";

  const images = await Promise.all(
    prompts.map(async (item) => {
      try {
        const payload: Record<string, unknown> = {
          model: imageModel,
          prompt: item.prompt,
          size: "2048x2048",
          response_format: "b64_json",
          watermark: true,
        };

        if (referenceImages.length === 1) {
          payload.image = referenceImages[0];
        } else if (referenceImages.length > 1) {
          payload.image = referenceImages;
        }

        const response = await fetch(`${baseUrl}/images/generations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.ARK_API_KEY}`,
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.error?.message ||
              result?.message ||
              "Image generation request failed"
          );
        }

        const first = result?.data?.[0];

        if (first?.b64_json) {
          return {
            title: item.title,
            prompt: item.prompt,
            b64Json: first.b64_json,
            revisedPrompt: first.revised_prompt,
          };
        }

        if (first?.url) {
          return {
            title: item.title,
            prompt: item.prompt,
            url: first.url,
            revisedPrompt: first.revised_prompt,
          };
        }

        return {
          title: item.title,
          prompt: item.prompt,
          error: "No image returned by the model.",
        };
      } catch (error: unknown) {
        return {
          title: item.title,
          prompt: item.prompt,
          error: error instanceof Error ? error.message : "Image generation failed",
        };
      }
    })
  );

  const hasSuccess = images.some((item) => item.url || item.b64Json);

  return {
    status: hasSuccess ? "completed" : "pending",
    note: hasSuccess
      ? `Images generated successfully via ${generationMode}.`
      : "Image generation attempted but no usable image was returned.",
    images,
  };
}
