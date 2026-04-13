import { NextResponse } from "next/server";
import {
  createBrandForUser,
  ensurePrimaryBrandForUser,
  getBrandForUser,
  getBrandsForUser,
  slugifyBrandName,
} from "@/lib/brand";
import { getUserFromBearerRequest } from "@/lib/server-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function hydrateMembers(rawMembers: Array<Record<string, unknown>>) {
  return Promise.all(
    rawMembers.map(async (member) => {
      const userId = member.user_id?.toString() || "";

      if (!userId) {
        return {
          ...member,
          email: null,
          display_name: null,
        };
      }

      const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

      if (error || !data.user) {
        return {
          ...member,
          email: null,
          display_name: null,
        };
      }

      return {
        ...member,
        email: data.user.email || null,
        display_name: data.user.user_metadata?.display_name?.toString().trim() || null,
      };
    })
  );
}

export async function GET(req: Request) {
  try {
    const { user, error } = await getUserFromBearerRequest(req);

    if (error || !user) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const requestedBrandId = searchParams.get("brandId");
    const selectedBrand =
      requestedBrandId ? await getBrandForUser({ brandId: requestedBrandId, userId: user.id }) : null;

    if (requestedBrandId && !selectedBrand) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { brand, membership } = selectedBrand || (await ensurePrimaryBrandForUser(user));
    const brands = await getBrandsForUser(user.id);
    const { data: members, error: membersError } = await supabaseAdmin
      .from("brand_members")
      .select("*")
      .eq("brand_id", brand.id)
      .order("created_at", { ascending: true });

    if (membersError) {
      throw new Error(membersError.message);
    }

    const { data: invites, error: invitesError } = await supabaseAdmin
      .from("brand_invites")
      .select("*")
      .eq("brand_id", brand.id)
      .order("created_at", { ascending: false });

    if (invitesError) {
      throw new Error(invitesError.message);
    }

    const hydratedMembers = await hydrateMembers((members || []) as Array<Record<string, unknown>>);

    return NextResponse.json({
      data: {
        brand,
        membership,
        brands,
        members: hydratedMembers,
        invites: invites || [],
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load brand" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { user, error } = await getUserFromBearerRequest(req);

    if (error || !user) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const name = body.name?.toString().trim();
    const description = body.description?.toString().trim() || null;
    const primaryColor = body.primaryColor?.toString().trim() || null;
    const enabledPlatforms = Array.isArray(body.enabledPlatforms)
      ? body.enabledPlatforms
          .map((item: unknown) => item?.toString().trim())
          .filter((item: string) => Boolean(item))
      : null;

    if (!name) {
      return NextResponse.json({ error: "Brand name is required" }, { status: 400 });
    }

    const { brand, membership } = await createBrandForUser({
      user,
      name,
      description,
      primaryColor,
      enabledPlatforms,
    });

    const brands = await getBrandsForUser(user.id);

    return NextResponse.json({
      data: {
        brand,
        membership,
        brands,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create brand" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { user, error } = await getUserFromBearerRequest(req);

    if (error || !user) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const requestedBrandId = searchParams.get("brandId");
    const selectedBrand =
      requestedBrandId ? await getBrandForUser({ brandId: requestedBrandId, userId: user.id }) : null;

    if (requestedBrandId && !selectedBrand) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { brand, membership } = selectedBrand || (await ensurePrimaryBrandForUser(user));

    if (!["owner", "admin"].includes(membership.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const name = body.name?.toString().trim();
    const description = body.description?.toString().trim() || null;
    const website = body.website?.toString().trim() || null;
    const voiceTone = body.voiceTone?.toString().trim() || null;
    const targetAudience = body.targetAudience?.toString().trim() || null;
    const primaryColor = body.primaryColor?.toString().trim() || null;
    const enabledPlatforms = Array.isArray(body.enabledPlatforms)
      ? body.enabledPlatforms
          .map((item: unknown) => item?.toString().trim())
          .filter((item: string) => Boolean(item))
      : null;

    if (!name) {
      return NextResponse.json({ error: "Brand name is required" }, { status: 400 });
    }

    const slug = `${slugifyBrandName(name)}-${brand.id.replace(/-/g, "").slice(0, 8)}`;

    const { data: updatedBrand, error: updateError } = await supabaseAdmin
      .from("brands")
      .update({
        name,
        slug,
        description,
        website,
        voice_tone: voiceTone,
        target_audience: targetAudience,
        primary_color: primaryColor,
        enabled_platforms: enabledPlatforms,
        updated_at: new Date().toISOString(),
      })
      .eq("id", brand.id)
      .select("*")
      .single();

    if (updateError || !updatedBrand) {
      return NextResponse.json(
        { error: updateError?.message || "Failed to update brand" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: {
        brand: updatedBrand,
        membership,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update brand" },
      { status: 500 }
    );
  }
}
