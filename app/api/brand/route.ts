import { NextResponse } from "next/server";
import { ensurePrimaryBrandForUser, slugifyBrandName } from "@/lib/brand";
import { getUserFromBearerRequest } from "@/lib/server-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: Request) {
  try {
    const { user, error } = await getUserFromBearerRequest(req);

    if (error || !user) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
    }

    const { brand, membership } = await ensurePrimaryBrandForUser(user);

    return NextResponse.json({
      data: {
        brand,
        membership,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load brand" },
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

    const { brand, membership } = await ensurePrimaryBrandForUser(user);

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
