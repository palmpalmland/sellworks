import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getBillingPlanDefinition } from "@/lib/billing-plans";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const freePlan = getBillingPlanDefinition("free");

    const { error } = await supabase
      .from("usage_limits")
      .insert({
        user_id: userId,
        credits_total: freePlan.creditsIncluded,
        credits_used: 0,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to init usage" },
      { status: 500 }
    );
  }
}
