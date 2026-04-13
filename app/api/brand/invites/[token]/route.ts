import { NextResponse } from "next/server";
import { getUserFromBearerRequest } from "@/lib/server-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(
  _req: Request,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;

    const { data: invite, error: inviteError } = await supabaseAdmin
      .from("brand_invites")
      .select("*")
      .eq("token", token)
      .maybeSingle();

    if (inviteError) {
      throw new Error(inviteError.message);
    }

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    const { data: brand, error: brandError } = await supabaseAdmin
      .from("brands")
      .select("*")
      .eq("id", invite.brand_id)
      .maybeSingle();

    if (brandError) {
      throw new Error(brandError.message);
    }

    return NextResponse.json({
      data: {
        invite,
        brand,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load invite" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { user, error } = await getUserFromBearerRequest(req);

    if (error || !user) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
    }

    const { token } = await context.params;

    const { data: invite, error: inviteError } = await supabaseAdmin
      .from("brand_invites")
      .select("*")
      .eq("token", token)
      .maybeSingle();

    if (inviteError) {
      throw new Error(inviteError.message);
    }

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    if (invite.status !== "pending") {
      return NextResponse.json(
        {
          data: {
            invite,
            membershipCreated: false,
          },
        },
        { status: 200 }
      );
    }

    const userEmail = user.email?.trim().toLowerCase();
    const inviteEmail = invite.email?.trim().toLowerCase();

    if (!userEmail || userEmail !== inviteEmail) {
      return NextResponse.json(
        { error: `This invite is reserved for ${invite.email}.` },
        { status: 403 }
      );
    }

    const { data: existingMembership, error: membershipLookupError } = await supabaseAdmin
      .from("brand_members")
      .select("*")
      .eq("brand_id", invite.brand_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (membershipLookupError) {
      throw new Error(membershipLookupError.message);
    }

    let membershipCreated = false;

    if (!existingMembership) {
      const { error: membershipInsertError } = await supabaseAdmin
        .from("brand_members")
        .insert({
          brand_id: invite.brand_id,
          user_id: user.id,
          role: invite.role,
        });

      if (membershipInsertError) {
        throw new Error(membershipInsertError.message);
      }

      membershipCreated = true;
    }

    const { data: acceptedInvite, error: inviteUpdateError } = await supabaseAdmin
      .from("brand_invites")
      .update({
        status: "accepted",
      })
      .eq("id", invite.id)
      .select("*")
      .single();

    if (inviteUpdateError || !acceptedInvite) {
      throw new Error(inviteUpdateError?.message || "Failed to accept invite");
    }

    const { data: brand, error: brandError } = await supabaseAdmin
      .from("brands")
      .select("*")
      .eq("id", invite.brand_id)
      .single();

    if (brandError || !brand) {
      throw new Error(brandError?.message || "Brand not found");
    }

    return NextResponse.json({
      data: {
        invite: acceptedInvite,
        brand,
        membershipCreated,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to accept invite" },
      { status: 500 }
    );
  }
}
