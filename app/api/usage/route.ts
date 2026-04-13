import { NextResponse } from "next/server";
import { getBillingSummaryForUser } from "@/lib/billing";
import { getBillingPlanDefinition } from "@/lib/billing-plans";
import { getUserFromBearerRequest } from "@/lib/server-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const brandId = searchParams.get("brandId");
    const { user } = await getUserFromBearerRequest(req);

    if (user) {
      const summary = await getBillingSummaryForUser({
        user,
        brandId,
      });

      return NextResponse.json({
        data: summary,
      });
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("plan")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("usage_limits")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json({
        data: {
          ...existing,
          plan: profile?.plan || "free",
          credits_remaining: existing.credits_total - existing.credits_used,
        },
      });
    }

    const { data: newUsage, error: insertError } = await supabaseAdmin
      .from("usage_limits")
      .insert({
        user_id: userId,
        credits_total: getBillingPlanDefinition(profile?.plan || "free").creditsIncluded,
        credits_used: 0,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: {
        ...newUsage,
        plan: profile?.plan || "free",
        credits_remaining: newUsage.credits_total - newUsage.credits_used,
      },
    });
  } catch (error: unknown) {
    console.error("usage api error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch usage",
      },
      { status: 500 }
    );
  }
}
