import { NextResponse } from "next/server";
import { PROJECT_ASSETS_BUCKET } from "@/lib/project-storage";
import { getUserFromBearerRequest } from "@/lib/server-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

type AssetRow = {
  id: string;
  projectId: string;
  projectName: string;
  platform: string;
  kind: "Copy" | "Images" | "Video";
  title: string;
  preview: string;
  createdAt: string;
  thumbnail?: string;
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
    throw new Error(error?.message || "Failed to sign asset URLs");
  }

  return new Map(
    data
      .filter((item) => item.signedUrl)
      .map((item, index) => [uniquePaths[index], item.signedUrl as string])
  );
}

export async function GET(req: Request) {
  try {
    const { user, error: authError } = await getUserFromBearerRequest(req);

    if (authError || !user) {
      return NextResponse.json({ error: authError || "Unauthorized" }, { status: 401 });
    }

    const { data: projects, error: projectsError } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (projectsError) {
      return NextResponse.json({ error: projectsError.message }, { status: 500 });
    }

    const projectIds = (projects || []).map((project) => project.id);

    if (projectIds.length === 0) {
      return NextResponse.json({ data: [] });
    }

    const { data: outputs, error: outputsError } = await supabaseAdmin
      .from("project_outputs")
      .select("*")
      .in("project_id", projectIds)
      .order("created_at", { ascending: false });

    if (outputsError) {
      return NextResponse.json({ error: outputsError.message }, { status: 500 });
    }

    const imageStoragePaths =
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

    const signedUrlMap = await createSignedUrlMap(imageStoragePaths);
    const projectMap = new Map((projects || []).map((project) => [project.id, project]));

    const rows = (outputs || []).flatMap((output): AssetRow[] => {
      const project = projectMap.get(output.project_id);

      if (!project) {
        return [];
      }

      if (output.output_type === "copy") {
        return [
          {
            id: output.id,
            projectId: project.id,
            projectName: project.product_name,
            platform: project.platform,
            kind: "Copy",
            title: output.title || project.product_name,
            preview: output.content || "Generated copy asset",
            createdAt: output.created_at,
          },
        ];
      }

      if (output.output_type === "image") {
        const images = Array.isArray(output.meta?.images)
          ? (output.meta.images as Array<{
              title?: string;
              url?: string | null;
              storagePath?: string;
              prompt?: string;
            }>)
          : [];

        return images.map((image, index) => ({
          id: `${output.id}-${index}`,
          projectId: project.id,
          projectName: project.product_name,
          platform: project.platform,
          kind: "Images",
          title: image.title || `Image ${index + 1}`,
          preview: image.prompt || "Generated image asset",
          createdAt: output.created_at,
          thumbnail:
            (image.storagePath ? signedUrlMap.get(image.storagePath) : null) ||
            image.url ||
            undefined,
        }));
      }

      if (output.output_type === "video") {
        const tasks = Array.isArray(output.meta?.tasks)
          ? (output.meta.tasks as Array<{
              title?: string;
              prompt?: string;
              resultUrl?: string | null;
            }>)
          : [];

        return tasks.map((task, index) => ({
          id: `${output.id}-${index}`,
          projectId: project.id,
          projectName: project.product_name,
          platform: project.platform,
          kind: "Video",
          title: task.title || `Video ${index + 1}`,
          preview: task.prompt || "Generated video asset",
          createdAt: output.created_at,
          thumbnail: task.resultUrl || undefined,
        }));
      }

      return [];
    });

    return NextResponse.json({ data: rows });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load assets" },
      { status: 500 }
    );
  }
}
