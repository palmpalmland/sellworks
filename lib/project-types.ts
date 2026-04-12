export type ProjectStatus = "draft" | "processing" | "completed" | "failed";

export type ProjectRecord = {
  id: string;
  user_id: string;
  brand_id: string | null;
  product_name: string;
  selling_points: string;
  platform: string;
  style: string | null;
  product_url: string | null;
  status: ProjectStatus;
  created_at: string;
};

export type BrandRecord = {
  id: string;
  owner_user_id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  logo_url: string | null;
  voice_tone: string | null;
  target_audience: string | null;
  primary_color: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectOutputRecord = {
  id: string;
  project_id: string;
  output_type: "copy" | "image_prompt" | "image" | "video";
  title: string | null;
  content: string | null;
  meta: Record<string, unknown> | null;
  status: string;
  created_at: string;
};

export type ProjectAssetRecord = {
  id: string;
  project_id: string;
  asset_type: "product_image" | "reference_video";
  file_name: string | null;
  mime_type: string | null;
  file_size: number | null;
  source_url: string | null;
  storage_path: string | null;
  signed_url?: string | null;
  status: string;
  created_at: string;
};
