import { NextResponse } from "next/server";
import { getBrandForUser } from "@/lib/brand";
import { getUserFromBearerRequest } from "@/lib/server-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function PATCH(req: Request) {
  try {
    const { user, error } = await getUserFromBearerRequest(req);

    if (error || !user) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const brandId = body.brandId?.toString().trim();
    const memberId = body.memberId?.toString().trim();
    const role = body.role?.toString().trim().toLowerCase();

    if (!brandId || !memberId || !role) {
      return NextResponse.json({ error: "Brand id, member id, and role are required" }, { status: 400 });
    }

    if (!["owner", "admin", "editor", "viewer"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const membership = await getBrandForUser({ brandId, userId: user.id });

    if (!membership || !["owner", "admin"].includes(membership.membership.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: targetMember, error: targetMemberError } = await supabaseAdmin
      .from("brand_members")
      .select("*")
      .eq("id", memberId)
      .eq("brand_id", brandId)
      .maybeSingle();

    if (targetMemberError) {
      throw new Error(targetMemberError.message);
    }

    if (!targetMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    if (targetMember.user_id === user.id && role !== "owner") {
      return NextResponse.json({ error: "You cannot downgrade your own owner role here." }, { status: 400 });
    }

    const { data: updatedMember, error: updateError } = await supabaseAdmin
      .from("brand_members")
      .update({ role })
      .eq("id", memberId)
      .select("*")
      .single();

    if (updateError || !updatedMember) {
      throw new Error(updateError?.message || "Failed to update member role");
    }

    return NextResponse.json({
      data: {
        member: updatedMember,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update member" },
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
    const memberId = body.memberId?.toString().trim();

    if (!brandId || !memberId) {
      return NextResponse.json({ error: "Brand id and member id are required" }, { status: 400 });
    }

    const membership = await getBrandForUser({ brandId, userId: user.id });

    if (!membership || !["owner", "admin"].includes(membership.membership.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: targetMember, error: targetMemberError } = await supabaseAdmin
      .from("brand_members")
      .select("*")
      .eq("id", memberId)
      .eq("brand_id", brandId)
      .maybeSingle();

    if (targetMemberError) {
      throw new Error(targetMemberError.message);
    }

    if (!targetMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    if (targetMember.user_id === user.id) {
      return NextResponse.json({ error: "You cannot remove yourself from the current brand here." }, { status: 400 });
    }

    const { error: deleteError } = await supabaseAdmin
      .from("brand_members")
      .delete()
      .eq("id", memberId);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to remove member" },
      { status: 500 }
    );
  }
}
