import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getUserFromBearerRequest } from "@/lib/server-auth";
import {
  generateEcommerceCopy,
  generateImagePrompts,
  generateImagesFromPrompts,
} from "@/lib/byteplus";
import {
  buildProjectAssetPath,
  PROJECT_ASSETS_BUCKET,
  type UploadedProjectAsset,
} from "@/lib/project-storage";
import { getUsage, incrementUsage, logUsage } from "@/lib/usage";

type PersistedGeneratedImage = {
  title: string;
  prompt: string;
  url?: string;
  storagePath?: string;
  revisedPrompt?: string;
  error?: string;
};

async function createSignedUrlMap(storagePaths: string[], expiresIn = 60 * 60) {
  const uniquePaths = Array.from(new Set(storagePaths.filter(Boolean)));

  if (uniquePaths.length === 0) {
    return new Map<string, string>();
  }

  const { data, error } = await supabaseAdmin.storage
    .from(PROJECT_ASSETS_BUCKET)
    .createSignedUrls(uniquePaths, expiresIn);

  if (error || !data) {
    throw new Error(error?.message || "Failed to sign storage assets");
  }

  return new Map(
    data
      .filter((item) => item.signedUrl)
      .map((item, index) => [uniquePaths[index], item.signedUrl as string])
  );
}

async function persistGeneratedImages(params: {
  userId: string;
  projectId: string;
  images: Array<{
    title: string;
    prompt: string;
    b64Json?: string;
    url?: string;
    revisedPrompt?: string;
    error?: string;
  }>;
}) {
  const { userId, projectId, images } = params;

  const persistedImages = await Promise.all(
    images.map(async (image, index) => {
      if (!image.b64Json) {
        return {
          title: image.title,
          prompt: image.prompt,
          url: image.url,
          revisedPrompt: image.revisedPrompt,
          error: image.error,
        } satisfies PersistedGeneratedImage;
      }

      const storagePath = buildProjectAssetPath({
        userId,
        assetType: "generated_image",
        fileName: `${projectId}-${index + 1}.png`,
      });

      const buffer = Buffer.from(image.b64Json, "base64");

      const { error } = await supabaseAdmin.storage
        .from(PROJECT_ASSETS_BUCKET)
        .upload(storagePath, buffer, {
          contentType: "image/png",
          upsert: false,
        });

      if (error) {
        return {
          title: image.title,
          prompt: image.prompt,
          revisedPrompt: image.revisedPrompt,
          error: error.message,
        } satisfies PersistedGeneratedImage;
      }

      return {
        title: image.title,
        prompt: image.prompt,
        storagePath,
        revisedPrompt: image.revisedPrompt,
      } satisfies PersistedGeneratedImage;
    })
  );

  const signedUrlMap = await createSignedUrlMap(
    persistedImages
      .map((item) => item.storagePath)
      .filter((item): item is string => Boolean(item))
  );

  return persistedImages.map((item) => ({
    ...item,
    url: item.storagePath ? signedUrlMap.get(item.storagePath) : item.url,
  }));
}

export async function POST(req: Request) {
  try {
    const { user, error: authError } = await getUserFromBearerRequest(req);

    if (authError || !user) {
      return NextResponse.json({ error: authError || "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      productName,
      sellingPoints,
      platform,
      style,
      productUrl,
      uploadedAssets,
    } = body as {
      productName?: string;
      sellingPoints?: string;
      platform?: string;
      style?: string;
      productUrl?: string;
      uploadedAssets?: UploadedProjectAsset[];
    };

    if (!productName || !sellingPoints || !platform || !style) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const usage = await getUsage(user.id);

    if (usage.credits_used >= usage.credits_total) {
      return NextResponse.json(
        { error: "Usage limit reached" },
        { status: 403 }
      );
    }

    const normalizedAssets = Array.isArray(uploadedAssets)
      ? uploadedAssets.filter((asset) => asset?.assetType && asset?.storagePath)
      : [];

    const { data: project, error: projectError } = await supabaseAdmin
      .from("projects")
      .insert({
        user_id: user.id,
        product_name: productName,
        selling_points: sellingPoints,
        platform,
        style,
        product_url: productUrl || null,
        status: "processing",
      })
      .select()
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: projectError?.message || "Failed to create project" },
        { status: 500 }
      );
    }

    const assetRows = normalizedAssets.map((asset) => ({
      project_id: project.id,
      asset_type: asset.assetType,
      file_name: asset.fileName,
      mime_type: asset.mimeType || null,
      file_size: asset.fileSize || null,
      storage_path: asset.storagePath,
      status: "uploaded",
    }));

    if (assetRows.length > 0) {
      const { error } = await supabaseAdmin.from("project_assets").insert(assetRows);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }
    }

    const productImagePaths = normalizedAssets
      .filter((asset) => asset.assetType === "product_image")
      .map((asset) => asset.storagePath);

    const referenceImageUrlMap = await createSignedUrlMap(productImagePaths);
    const referenceImageUrls = productImagePaths
      .map((path) => referenceImageUrlMap.get(path))
      .filter((item): item is string => Boolean(item));

    const copy = await generateEcommerceCopy({
      title: productName,
      description: sellingPoints,
      platform,
      style,
      productUrl,
    });

    const imagePrompts = await generateImagePrompts({
      title: productName,
      sellingPoints,
      platform,
      style,
      productUrl,
      copy,
      referenceImageCount: productImagePaths.length,
    });

    const imageGeneration = await generateImagesFromPrompts(imagePrompts, {
      referenceImages: referenceImageUrls,
    });

    const persistedImages = await persistGeneratedImages({
      userId: user.id,
      projectId: project.id,
      images: imageGeneration.images,
    });

    const outputs = [
      {
        project_id: project.id,
        output_type: "copy",
        title: "Generated Copy",
        content: copy,
        status: "completed",
      },
      {
        project_id: project.id,
        output_type: "image_prompt",
        title: "Image Prompts",
        content: imagePrompts.map((item) => `${item.title}\n${item.prompt}`).join("\n\n"),
        meta: {
          prompts: imagePrompts,
        },
        status: "completed",
      },
      {
        project_id: project.id,
        output_type: "image",
        title: "Generated Images",
        content: imageGeneration.note,
        meta: {
          state: imageGeneration.status,
          note: imageGeneration.note,
          generationMode: referenceImageUrls.length > 0 ? "image-to-image" : "text-to-image",
          prompts: imagePrompts,
          images: persistedImages,
        },
        status: imageGeneration.status,
      },
      {
        project_id: project.id,
        output_type: "video",
        title: "Video",
        content: null,
        meta: {
          state: "pending",
          note: "Video generation will be connected in the next step.",
        },
        status: "pending",
      },
    ];

    const { error: outputError } = await supabaseAdmin
      .from("project_outputs")
      .insert(outputs);

    if (outputError) {
      return NextResponse.json(
        { error: outputError.message },
        { status: 500 }
      );
    }

    await supabaseAdmin
      .from("projects")
      .update({ status: imageGeneration.status === "completed" ? "completed" : "processing" })
      .eq("id", project.id);

    await incrementUsage(user.id, 1);
    await logUsage(user.id, "project_copy", 1);

    return NextResponse.json({
      success: true,
      projectId: project.id,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create project",
      },
      { status: 500 }
    );
  }
}
