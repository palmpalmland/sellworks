import { NextResponse } from "next/server";
import { getBrandForUser } from "@/lib/brand";
import { getUserFromBearerRequest } from "@/lib/server-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const { user, error } = await getUserFromBearerRequest(req);

    if (error || !user) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const brandId = body.brandId?.toString().trim();
    const email = body.email?.toString().trim().toLowerCase();
    const role = body.role?.toString().trim().toLowerCase() || "editor";

    if (!brandId) {
      return NextResponse.json({ error: "Brand id is required" }, { status: 400 });
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid invite email is required" }, { status: 400 });
    }

    if (!["admin", "editor", "viewer"].includes(role)) {
      return NextResponse.json({ error: "Invalid invite role" }, { status: 400 });
    }

    const membership = await getBrandForUser({ brandId, userId: user.id });

    if (!membership || !["owner", "admin"].includes(membership.membership.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: existingInvite, error: existingInviteError } = await supabaseAdmin
      .from("brand_invites")
      .select("*")
      .eq("brand_id", brandId)
      .eq("email", email)
      .eq("status", "pending")
      .maybeSingle();

    if (existingInviteError) {
      throw new Error(existingInviteError.message);
    }

    if (existingInvite) {
      return NextResponse.json({
        data: {
          invite: existingInvite,
          brand: membership.brand,
        },
      });
    }

    const { data: invite, error: inviteError } = await supabaseAdmin
      .from("brand_invites")
      .insert({
        brand_id: brandId,
        email,
        role,
        invited_by: user.id,
        status: "pending",
      })
      .select("*")
      .single();

    if (inviteError || !invite) {
      throw new Error(inviteError?.message || "Failed to create invite");
    }

    return NextResponse.json({
      data: {
        invite,
        brand: membership.brand,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create invite" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { user, error } = await getUserFromBearerRequest(req);

    if (error || !user) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const brandId = body.brandId?.toString().trim();
    const inviteId = body.inviteId?.toString().trim();

    if (!brandId || !inviteId) {
      return NextResponse.json({ error: "Brand id and invite id are required" }, { status: 400 });
    }

    const membership = await getBrandForUser({ brandId, userId: user.id });

    if (!membership || !["owner", "admin"].includes(membership.membership.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error: deleteError } = await supabaseAdmin
      .from("brand_invites")
      .delete()
      .eq("id", inviteId)
      .eq("brand_id", brandId);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to revoke invite" },
      { status: 500 }
    );
  }
}
