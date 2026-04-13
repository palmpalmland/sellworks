import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createClient } from "@supabase/supabase-js";
import { ensureBillingAccountForBrand } from "@/lib/billing";
import { ensurePrimaryBrandForUser, getBrandForUser } from "@/lib/brand";
import { getBillingPlanDefinition, type BillingPlanKey } from "@/lib/billing-plans";

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

    const body = await req.json().catch(() => ({}));
    const planKey = (body.planKey?.toString().trim().toLowerCase() || "pro") as BillingPlanKey;
    const requestedBrandId = body.brandId?.toString().trim() || null;
    const plan = getBillingPlanDefinition(planKey);

    if (!plan.stripePriceEnvKey) {
      return NextResponse.json({ error: "This plan does not require checkout." }, { status: 400 });
    }

    const scopedBrand =
      requestedBrandId
        ? await getBrandForUser({ brandId: requestedBrandId, userId: user.id })
        : await ensurePrimaryBrandForUser(user);

    if (!scopedBrand) {
      return NextResponse.json({ error: "Brand workspace not found" }, { status: 404 });
    }

    const billingContext = await ensureBillingAccountForBrand({
      user,
      brand: scopedBrand.brand,
    });

    if (!billingContext && planKey === "team") {
      return NextResponse.json(
        { error: "Team billing needs the new billing framework. Run the latest billing migration first." },
        { status: 409 }
      );
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id, email")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    let stripeCustomerId = profile?.stripe_customer_id;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email || profile?.email || undefined,
        metadata: {
          supabase_user_id: user.id,
          brand_id: scopedBrand.brand.id,
          billing_account_id: billingContext?.account.id || "",
        },
      });

      stripeCustomerId = customer.id;

      await supabaseAdmin
        .from("profiles")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", user.id);

      if (billingContext) {
        await supabaseAdmin
          .from("billing_accounts")
          .update({ stripe_customer_id: stripeCustomerId })
          .eq("id", billingContext.account.id);
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      line_items: [
        {
          price: process.env[plan.stripePriceEnvKey]!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?canceled=1`,
      metadata: {
        user_id: user.id,
        brand_id: scopedBrand.brand.id,
        billing_account_id: billingContext?.account.id || "",
        plan_key: plan.key,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
