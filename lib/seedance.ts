const SEEDANCE_BASE_URL =
  process.env.ARK_BASE_URL || "https://ark.cn-beijing.volces.com/api/v3";

const SEEDANCE_MODEL =
  process.env.LAS_VIDEO_MODEL ||
  process.env.ARK_VIDEO_MODEL ||
  "doubao-seedance-1-0-pro-250528";

function getApiKey() {
  return process.env.ARK_API_KEY || process.env.LAS_API_KEY || "";
}

type SeedanceContentItem =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "image_url";
      image_url: {
        url: string;
      };
    };

export type SeedanceTaskResult = {
  id: string;
  model?: string;
  status: string;
  error?: {
    code?: string;
    message?: string;
  } | null;
  content?: {
    video_url?: string;
    last_frame_url?: string;
  } | null;
  resolution?: string;
  ratio?: string;
  duration?: number;
};

function extractSeedanceError(result: any) {
  const directMessage =
    result?.error?.message ||
    result?.message ||
    result?.msg ||
    result?.detail;

  if (directMessage) {
    return String(directMessage);
  }

  try {
    return JSON.stringify(result);
  } catch {
    return "Unknown Seedance API error.";
  }
}

export async function createSeedanceTask(params: {
  prompt: string;
  imageUrl?: string;
  ratio?: string;
  duration?: number;
}) {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error("Missing ARK API key for video generation.");
  }

  const promptWithFlags = `${params.prompt} --duration ${params.duration || 5} --watermark true`.trim();

  const content: SeedanceContentItem[] = [
    {
      type: "text",
      text: promptWithFlags,
    },
  ];

  if (params.imageUrl) {
    content.push({
      type: "image_url",
      image_url: {
        url: params.imageUrl,
      },
    });
  }

  const response = await fetch(`${SEEDANCE_BASE_URL}/contents/generations/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: SEEDANCE_MODEL,
      content,
    }),
  });

  const result = await response.json();

  if (!response.ok || !result?.id) {
    throw new Error(`Failed to create Seedance task: ${extractSeedanceError(result)}`);
  }

  return {
    id: String(result.id),
    model: SEEDANCE_MODEL,
    status: "queued",
  };
}

export async function fetchSeedanceTask(taskId: string) {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error("Missing ARK API key for video generation.");
  }

  const response = await fetch(
    `${SEEDANCE_BASE_URL}/contents/generations/tasks/${taskId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  const result = (await response.json()) as SeedanceTaskResult;

  if (!response.ok) {
    throw new Error(`Failed to fetch Seedance task status: ${extractSeedanceError(result)}`);
  }

  return result;
}
