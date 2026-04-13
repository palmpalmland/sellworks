import type { User } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-admin";

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

type BrandMemberRecord = {
  id: string;
  brand_id: string;
  user_id: string;
  role: string;
  created_at: string;
};

export type BrandMembershipWithBrand = {
  brand: BrandRecord;
  membership: BrandMemberRecord;
};

export function slugifyBrandName(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "brand";
}

function getDefaultBrandName(user: User) {
  const displayName = user.user_metadata?.display_name?.toString().trim();
  return displayName ? `${displayName}'s Brand` : "My Brand";
}

export async function getPrimaryBrandForUser(userId: string) {
  const { data: membership, error: membershipError } = await supabaseAdmin
    .from("brand_members")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    throw new Error(membershipError.message);
  }

  if (!membership) {
    return null;
  }

  const typedMembership = membership as BrandMemberRecord;

  const { data: brand, error: brandError } = await supabaseAdmin
    .from("brands")
    .select("*")
    .eq("id", typedMembership.brand_id)
    .single();

  if (brandError || !brand) {
    throw new Error(brandError?.message || "Brand not found");
  }

  return {
    brand: brand as BrandRecord,
    membership: typedMembership,
  };
}

export async function getBrandForUser(params: { brandId: string; userId: string }) {
  const { brandId, userId } = params;

  const { data: membership, error: membershipError } = await supabaseAdmin
    .from("brand_members")
    .select("*")
    .eq("brand_id", brandId)
    .eq("user_id", userId)
    .maybeSingle();

  if (membershipError) {
    throw new Error(membershipError.message);
  }

  if (!membership) {
    return null;
  }

  const typedMembership = membership as BrandMemberRecord;

  const { data: brand, error: brandError } = await supabaseAdmin
    .from("brands")
    .select("*")
    .eq("id", typedMembership.brand_id)
    .single();

  if (brandError || !brand) {
    throw new Error(brandError?.message || "Brand not found");
  }

  return {
    brand: brand as BrandRecord,
    membership: typedMembership,
  };
}

export async function ensurePrimaryBrandForUser(user: User) {
  const existing = await getPrimaryBrandForUser(user.id);

  if (existing) {
    return existing;
  }

  const brandName = getDefaultBrandName(user);
  const slug = `${slugifyBrandName(brandName)}-${user.id.replace(/-/g, "").slice(0, 8)}`;

  const { data: brand, error: brandError } = await supabaseAdmin
    .from("brands")
    .insert({
      owner_user_id: user.id,
      name: brandName,
      slug,
      description: "Primary workspace for generated content, assets, and campaign outputs.",
      primary_color: "#6d7cff",
    })
    .select("*")
    .single();

  if (brandError || !brand) {
    throw new Error(brandError?.message || "Failed to create brand");
  }

  const { data: membership, error: membershipError } = await supabaseAdmin
    .from("brand_members")
    .insert({
      brand_id: brand.id,
      user_id: user.id,
      role: "owner",
    })
    .select("*")
    .single();

  if (membershipError || !membership) {
    throw new Error(membershipError?.message || "Failed to create brand membership");
  }

  return {
    brand: brand as BrandRecord,
    membership: membership as BrandMemberRecord,
  };
}

export async function createBrandForUser(params: {
  user: User;
  name: string;
  description?: string | null;
  primaryColor?: string | null;
}) {
  const { user, name, description, primaryColor } = params;
  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error("Brand name is required");
  }

  const slug = `${slugifyBrandName(trimmedName)}-${crypto.randomUUID().replace(/-/g, "").slice(0, 8)}`;

  const { data: brand, error: brandError } = await supabaseAdmin
    .from("brands")
    .insert({
      owner_user_id: user.id,
      name: trimmedName,
      slug,
      description: description || "Workspace for generated content, assets, and campaign outputs.",
      primary_color: primaryColor || "#6d7cff",
    })
    .select("*")
    .single();

  if (brandError || !brand) {
    throw new Error(brandError?.message || "Failed to create brand");
  }

  const { data: membership, error: membershipError } = await supabaseAdmin
    .from("brand_members")
    .insert({
      brand_id: brand.id,
      user_id: user.id,
      role: "owner",
    })
    .select("*")
    .single();

  if (membershipError || !membership) {
    throw new Error(membershipError?.message || "Failed to create brand membership");
  }

  return {
    brand: brand as BrandRecord,
    membership: membership as BrandMemberRecord,
  };
}

export async function getBrandsForUser(userId: string): Promise<BrandMembershipWithBrand[]> {
  const { data: memberships, error: membershipsError } = await supabaseAdmin
    .from("brand_members")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (membershipsError) {
    throw new Error(membershipsError.message);
  }

  const typedMemberships = (memberships || []) as BrandMemberRecord[];

  if (typedMemberships.length === 0) {
    return [];
  }

  const brandIds = typedMemberships.map((membership) => membership.brand_id);
  const { data: brands, error: brandsError } = await supabaseAdmin
    .from("brands")
    .select("*")
    .in("id", brandIds)
    .order("created_at", { ascending: true });

  if (brandsError) {
    throw new Error(brandsError.message);
  }

  const brandMap = new Map(((brands || []) as BrandRecord[]).map((brand) => [brand.id, brand]));

  return typedMemberships
    .map((membership) => {
      const brand = brandMap.get(membership.brand_id);
      if (!brand) {
        return null;
      }

      return {
        brand,
        membership,
      } satisfies BrandMembershipWithBrand;
    })
    .filter((item): item is BrandMembershipWithBrand => Boolean(item));
}

export async function assertBrandAccess(params: { brandId: string; userId: string }) {
  const { brandId, userId } = params;

  const { data: membership, error } = await supabaseAdmin
    .from("brand_members")
    .select("*")
    .eq("brand_id", brandId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return Boolean(membership);
}
