import Stripe from "stripe";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { assignPlanToBillingAccount } from "@/lib/billing";
import { getBillingPlanDefinition, type BillingPlanKey } from "@/lib/billing-plans";

async function syncLegacyUsage(userId: string, planKey: BillingPlanKey) {
  const plan = getBillingPlanDefinition(planKey);

  const { error } = await supabaseAdmin
    .from("usage_limits")
    .upsert(
      {
        user_id: userId,
        credits_total: plan.creditsIncluded,
        credits_used: 0,
      },
      { onConflict: "user_id" }
    );

  if (error) {
    throw new Error(`usage_limits upsert failed: ${error.message}`);
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.user_id;
        const brandId = session.metadata?.brand_id || null;
        const billingAccountId = session.metadata?.billing_account_id || null;
        const planKey = (session.metadata?.plan_key || "pro") as BillingPlanKey;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (!userId) {
          break;
        }

        await supabaseAdmin.from("payments").upsert(
          {
            user_id: userId,
            billing_account_id: billingAccountId,
            brand_id: brandId,
            stripe_customer_id: customerId,
            stripe_checkout_session_id: session.id,
            amount_total: session.amount_total,
            currency: session.currency,
            payment_status: session.payment_status,
          },
          { onConflict: "stripe_checkout_session_id" }
        );

        await supabaseAdmin
          .from("profiles")
          .update({
            plan: planKey,
          })
          .eq("id", userId);

        const subscription = (await stripe.subscriptions.retrieve(
          subscriptionId
        )) as Stripe.Subscription;

        if (billingAccountId) {
          await assignPlanToBillingAccount({
            billingAccountId,
            planKey,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0]?.price?.id || null,
            currentPeriodEnd: new Date(
              (subscription as Stripe.Subscription & { current_period_end: number }).current_period_end * 1000
            ).toISOString(),
            status: subscription.status,
          });
        } else {
          await syncLegacyUsage(userId, planKey);
        }

        await supabaseAdmin.from("subscriptions").upsert(
          {
            user_id: userId,
            billing_account_id: billingAccountId,
            brand_id: brandId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            stripe_price_id: subscription.items.data[0]?.price?.id || null,
            plan_key: planKey,
            status: subscription.status,
            current_period_end: new Date(
              (subscription as Stripe.Subscription & { current_period_end: number }).current_period_end * 1000
            ).toISOString(),
          },
          { onConflict: "stripe_subscription_id" }
        );

        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const planKey = (subscription.metadata?.plan_key || "pro") as BillingPlanKey;

        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        const { data: billingAccount } = await supabaseAdmin
          .from("billing_accounts")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .maybeSingle();

        if (profile?.id) {
          await supabaseAdmin.from("subscriptions").upsert(
            {
              user_id: profile.id,
              billing_account_id: billingAccount?.id || null,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
              stripe_price_id: subscription.items.data[0]?.price?.id || null,
              plan_key: planKey,
              status: subscription.status,
              current_period_end: new Date(
                (subscription as Stripe.Subscription & { current_period_end: number }).current_period_end * 1000
              ).toISOString(),
            },
            { onConflict: "stripe_subscription_id" }
          );

          await supabaseAdmin
            .from("profiles")
            .update({
              plan: subscription.status === "active" ? planKey : "free",
            })
            .eq("id", profile.id);

          if (!billingAccount?.id) {
            await syncLegacyUsage(profile.id, subscription.status === "active" ? planKey : "free");
          }
        }

        if (billingAccount?.id) {
          await assignPlanToBillingAccount({
            billingAccountId: billingAccount.id,
            planKey: subscription.status === "active" ? planKey : "free",
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0]?.price?.id || null,
            currentPeriodEnd: new Date(
              (subscription as Stripe.Subscription & { current_period_end: number }).current_period_end * 1000
            ).toISOString(),
            status: subscription.status,
          });
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        const { data: billingAccount } = await supabaseAdmin
          .from("billing_accounts")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .maybeSingle();

        if (profile?.id) {
          await supabaseAdmin
            .from("subscriptions")
            .update({
              status: subscription.status,
              plan_key: "free",
              current_period_end: new Date(
                (subscription as Stripe.Subscription & { current_period_end: number }).current_period_end * 1000
              ).toISOString(),
            })
            .eq("stripe_subscription_id", subscription.id);

          await supabaseAdmin
            .from("profiles")
            .update({
              plan: "free",
            })
            .eq("id", profile.id);

          if (!billingAccount?.id) {
            await syncLegacyUsage(profile.id, "free");
          }
        }

        if (billingAccount?.id) {
          await assignPlanToBillingAccount({
            billingAccountId: billingAccount.id,
            planKey: "free",
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0]?.price?.id || null,
            currentPeriodEnd: new Date(
              (subscription as Stripe.Subscription & { current_period_end: number }).current_period_end * 1000
            ).toISOString(),
            status: subscription.status,
          });
        }

        break;
      }

      default:
        break;
    }

    return new Response("ok", { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown webhook failure";
    return new Response(`Webhook handler failed: ${message}`, {
      status: 500,
    });
  }
}
