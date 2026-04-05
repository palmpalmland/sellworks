export const PROJECT_ASSETS_BUCKET = "project-assets";

export type UploadedProjectAsset = {
  assetType: "product_image" | "reference_video";
  fileName: string;
  mimeType: string;
  fileSize: number;
  storagePath: string;
};

function sanitizeFileName(fileName: string) {
  return fileName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-");
}

export function buildProjectAssetPath(params: {
  userId: string;
  assetType: "product_image" | "reference_video" | "generated_image";
  fileName: string;
}) {
  const { userId, assetType, fileName } = params;
  const safeName = sanitizeFileName(fileName || "asset");
  const uniquePrefix = `${Date.now()}-${crypto.randomUUID()}`;

  return `${userId}/${assetType}/${uniquePrefix}-${safeName}`;
}
