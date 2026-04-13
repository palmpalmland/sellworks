import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateEcommerceCopy } from "@/lib/byteplus";
import { supabase } from "@/lib/supabase";
import { consumeCredits, getBillingSummaryForUser } from "@/lib/billing";
import { ensurePrimaryBrandForUser } from "@/lib/brand";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    const supabaseUserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseUserClient.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Invalid user" }, { status: 401 });
    }

    const userId = user.id;
    const { title, description, platform, brandId } = await req.json();

    if (!title || !description || !platform) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const fallbackBrand = await ensurePrimaryBrandForUser(user);
    const scopedBrandId = brandId?.toString().trim() || fallbackBrand.brand.id;
    const usage = await getBillingSummaryForUser({
      user,
      brandId: scopedBrandId,
    });

    if (usage.credits_used >= usage.credits_total) {
      return NextResponse.json(
        { error: "Usage limit reached" },
        { status: 403 }
      );
    }

    const result = await generateEcommerceCopy({
      title,
      description,
      platform,
    });

    await consumeCredits({
      user,
      brandId: scopedBrandId,
      credits: 1,
      type: "text",
    });

    const { error: insertError } = await supabase.from("generations").insert([
      {
        user_id: userId,
        product_name: title,
        prompt: description,
        platform,
        result,
      },
    ]);

    if (insertError) {
      console.error("Supabase insert error:", insertError);
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    console.error("generate-text error:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate content" },
      { status: 500 }
    );
  }
}
