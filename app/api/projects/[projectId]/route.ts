import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getUserFromBearerRequest } from "@/lib/server-auth";
import { PROJECT_ASSETS_BUCKET } from "@/lib/project-storage";

type OutputImageRecord = {
  storagePath?: string;
  url?: string | null;
  [key: string]: unknown;
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

export async function GET(
  req: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  try {
    const { user, error: authError } = await getUserFromBearerRequest(req);

    if (authError || !user) {
      return NextResponse.json({ error: authError || "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await context.params;

    const { data: project, error: projectError } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: projectError?.message || "Project not found" },
        { status: 404 }
      );
    }

    const { data: outputs, error: outputsError } = await supabaseAdmin
      .from("project_outputs")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (outputsError) {
      return NextResponse.json(
        { error: outputsError.message },
        { status: 500 }
      );
    }

    const { data: assets, error: assetsError } = await supabaseAdmin
      .from("project_assets")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (assetsError) {
      return NextResponse.json(
        { error: assetsError.message },
        { status: 500 }
      );
    }

    const assetUrlMap = await createSignedUrlMap(
      (assets || [])
        .map((asset) => asset.storage_path)
        .filter((item): item is string => Boolean(item))
    );

    const hydratedAssets = (assets || []).map((asset) => ({
      ...asset,
      signed_url: asset.storage_path ? assetUrlMap.get(asset.storage_path) || null : null,
    }));

    const imageOutputPaths =
      (outputs || [])
        .filter((output) => output.output_type === "image")
        .flatMap((output) => {
          const images = Array.isArray(output.meta?.images) ? output.meta.images : [];
          return images
            .map((image: unknown) =>
              typeof image === "object" && image && "storagePath" in image
                ? image.storagePath
                : null
            )
            .filter((item: string | null): item is string => Boolean(item));
        }) || [];

    const outputUrlMap = await createSignedUrlMap(imageOutputPaths);

    const hydratedOutputs = (outputs || []).map((output) => {
      if (output.output_type !== "image" || !Array.isArray(output.meta?.images)) {
        return output;
      }

      const hydratedImages = output.meta.images.map((image: unknown) => {
        if (
          typeof image !== "object" ||
          !image ||
          !("storagePath" in image) ||
          typeof image.storagePath !== "string"
        ) {
          return image;
        }

        const typedImage = image as OutputImageRecord;

        return {
          ...typedImage,
          url: outputUrlMap.get(typedImage.storagePath || "") || typedImage.url || null,
        };
      });

      return {
        ...output,
        meta: {
          ...(output.meta || {}),
          images: hydratedImages,
        },
      };
    });

    return NextResponse.json({
      data: {
        project,
        outputs: hydratedOutputs,
        assets: hydratedAssets,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load project",
      },
      { status: 500 }
    );
  }
}
