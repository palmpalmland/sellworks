import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const { data: existing, error: fetchError } = await supabase
      .from("usage_limits")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (existing) {
      return NextResponse.json({
        data: {
          ...existing,
          credits_remaining: existing.credits_total - existing.credits_used,
        },
      });
    }

    const { data: newUsage, error: insertError } = await supabase
      .from("usage_limits")
      .insert({
        user_id: userId,
        credits_total: 20,
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
        credits_remaining: newUsage.credits_total - newUsage.credits_used,
      },
    });
  } catch (error: any) {
    console.error("usage api error:", error);

    return NextResponse.json(
      { error: error?.message || "Failed to fetch usage" },
      { status: 500 }
    );
  }
}