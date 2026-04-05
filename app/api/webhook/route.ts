import Stripe from "stripe";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature", { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        const userId = session.metadata?.user_id;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (userId) {
          await supabaseAdmin.from("payments").upsert(
            {
              user_id: userId,
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
              plan: "pro",
            })
            .eq("id", userId);

          // 同步更新 usage_limits（关键！）
          const { error: usageError } = await supabaseAdmin
            .from("usage_limits")
            .upsert(
              {
                user_id: userId,
                credits_total: 1000,
                credits_used: 0,
              },
              { onConflict: "user_id" }
            );

          if (usageError) {
            throw new Error(`usage_limits upsert failed: ${usageError.message}`);
          }

          const subscription = await stripe.subscriptions.retrieve(
            subscriptionId
          ) as Stripe.Subscription;

          await supabaseAdmin.from("subscriptions").upsert(
            {
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
              stripe_price_id: subscription.items.data[0]?.price?.id || null,
              status: subscription.status,
              current_period_end: new Date(
                (subscription as any).current_period_end * 1000
              ).toISOString(),
            },
            { onConflict: "stripe_subscription_id" }
          );
        }

        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (profile?.id) {
          await supabaseAdmin.from("subscriptions").upsert(
            {
              user_id: profile.id,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
              stripe_price_id: subscription.items.data[0]?.price?.id || null,
              status: subscription.status,
              current_period_end: new Date(
                (subscription as any).current_period_end * 1000
              ).toISOString(),
            },
            { onConflict: "stripe_subscription_id" }
          );

          await supabaseAdmin
            .from("profiles")
            .update({
              plan: subscription.status === "active" ? "pro" : "free",
            })
            .eq("id", profile.id);
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

        if (profile?.id) {
          await supabaseAdmin
            .from("subscriptions")
            .update({
              status: subscription.status,
              current_period_end: new Date(
                (subscription as any).current_period_end * 1000
              ).toISOString(),
            })
            .eq("stripe_subscription_id", subscription.id);

          await supabaseAdmin
            .from("profiles")
            .update({
              plan: "free",
              credits_total: 100,
            })
            .eq("id", profile.id);
        }

        break;
      }

      default:
        break;
    }

    return new Response("ok", { status: 200 });
  } catch (err: any) {
    return new Response(`Webhook handler failed: ${err.message}`, {
      status: 500,
    });
  }
}