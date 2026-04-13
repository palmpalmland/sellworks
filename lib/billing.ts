import { supabaseAdmin } from "@/lib/supabase-admin";
import { ensurePrimaryBrandForUser, getBrandForUser, type BrandRecord } from "@/lib/brand";
import { getBillingPlanDefinition, type BillingPlanKey } from "@/lib/billing-plans";
import type { User } from "@supabase/supabase-js";

type BillingAccountRecord = {
  id: string;
  owner_user_id: string;
  name: string;
  billing_scope: "brand" | "organization";
  plan_key: BillingPlanKey;
  status: string;
  credits_total: number;
  credits_used: number;
  member_limit: number;
  brand_limit: number;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
};

export type BillingSummary = {
  source: "framework" | "legacy";
  billing_account_id: string | null;
  brand_id: string | null;
  plan: BillingPlanKey;
  plan_label: string;
  billing_scope: "brand" | "organization";
  shared_credit_pool: boolean;
  credits_total: number;
  credits_used: number;
  credits_remaining: number;
  brands_included: number;
  brands_connected: number;
  members_included: number;
  current_period_end: string | null;
  status: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
};

function isMissingRelationError(error: unknown) {
  return (
    error instanceof Error &&
    (error.message.includes('relation "billing_accounts" does not exist') ||
      error.message.includes('relation "billing_account_brands" does not exist') ||
      error.message.includes("Could not find the table 'public.billing_accounts'") ||
      error.message.includes("Could not find the table 'public.billing_account_brands'"))
  );
}

function isMissingUsageLogColumnError(error: unknown) {
  return (
    error instanceof Error &&
    (error.message.includes("brand_id") || error.message.includes("billing_account_id"))
  );
}

function buildSummaryFromAccount(params: {
  account: BillingAccountRecord;
  brandId: string | null;
  brandsConnected: number;
}): BillingSummary {
  const { account, brandId, brandsConnected } = params;
  const plan = getBillingPlanDefinition(account.plan_key);

  return {
    source: "framework",
    billing_account_id: account.id,
    brand_id: brandId,
    plan: plan.key,
    plan_label: plan.label,
    billing_scope: plan.billingScope,
    shared_credit_pool: plan.sharedCreditPool,
    credits_total: account.credits_total,
    credits_used: account.credits_used,
    credits_remaining: Math.max(account.credits_total - account.credits_used, 0),
    brands_included: account.brand_limit,
    brands_connected: brandsConnected,
    members_included: account.member_limit,
    current_period_end: account.current_period_end,
    status: account.status,
    stripe_customer_id: account.stripe_customer_id,
    stripe_subscription_id: account.stripe_subscription_id,
  };
}

async function getConnectedBrandCount(billingAccountId: string) {
  const { count, error } = await supabaseAdmin
    .from("billing_account_brands")
    .select("*", { count: "exact", head: true })
    .eq("billing_account_id", billingAccountId);

  if (error) {
    throw new Error(error.message);
  }

  return count || 0;
}

export async function ensureBillingAccountForBrand(params: {
  user: User;
  brand?: BrandRecord | null;
  brandId?: string | null;
}) {
  const { user } = params;
  const resolvedBrand =
    params.brand ||
    (params.brandId
      ? (await getBrandForUser({ brandId: params.brandId, userId: user.id }))?.brand || null
      : (await ensurePrimaryBrandForUser(user)).brand);

  if (!resolvedBrand) {
    throw new Error("Brand workspace not found");
  }

  try {
    const { data: mapping, error: mappingError } = await supabaseAdmin
      .from("billing_account_brands")
      .select("billing_account_id")
      .eq("brand_id", resolvedBrand.id)
      .maybeSingle();

    if (mappingError) {
      throw new Error(mappingError.message);
    }

    if (mapping?.billing_account_id) {
      const { data: existingAccount, error: accountError } = await supabaseAdmin
        .from("billing_accounts")
        .select("*")
        .eq("id", mapping.billing_account_id)
        .single();

      if (accountError || !existingAccount) {
        throw new Error(accountError?.message || "Billing account not found");
      }

      return {
        brand: resolvedBrand,
        account: existingAccount as BillingAccountRecord,
      };
    }

    const freePlan = getBillingPlanDefinition("free");
    const { data: account, error: accountInsertError } = await supabaseAdmin
      .from("billing_accounts")
      .insert({
        owner_user_id: user.id,
        name: `${resolvedBrand.name} Billing ${resolvedBrand.id.replace(/-/g, "").slice(0, 8)}`,
        billing_scope: freePlan.billingScope,
        plan_key: freePlan.key,
        status: "active",
        credits_total: freePlan.creditsIncluded,
        credits_used: 0,
        member_limit: freePlan.membersIncluded,
        brand_limit: freePlan.brandsIncluded,
      })
      .select("*")
      .single();

    if (accountInsertError || !account) {
      throw new Error(accountInsertError?.message || "Failed to create billing account");
    }

    const { error: mappingInsertError } = await supabaseAdmin
      .from("billing_account_brands")
      .insert({
        billing_account_id: account.id,
        brand_id: resolvedBrand.id,
      });

    if (mappingInsertError) {
      throw new Error(mappingInsertError.message);
    }

    return {
      brand: resolvedBrand,
      account: account as BillingAccountRecord,
    };
  } catch (error: unknown) {
    if (isMissingRelationError(error)) {
      return null;
    }

    throw error;
  }
}

async function getLegacyBillingSummary(params: { userId: string; brandId?: string | null }) {
  const { userId, brandId = null } = params;
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  const { data: usage, error: usageError } = await supabaseAdmin
    .from("usage_limits")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (usageError) {
    throw new Error(usageError.message);
  }

  const plan = getBillingPlanDefinition(profile?.plan || "free");
  const creditsTotal = usage?.credits_total ?? plan.creditsIncluded;
  const creditsUsed = usage?.credits_used ?? 0;

  return {
    source: "legacy",
    billing_account_id: null,
    brand_id: brandId,
    plan: plan.key,
    plan_label: plan.label,
    billing_scope: plan.billingScope,
    shared_credit_pool: plan.sharedCreditPool,
    credits_total: creditsTotal,
    credits_used: creditsUsed,
    credits_remaining: Math.max(creditsTotal - creditsUsed, 0),
    brands_included: plan.brandsIncluded,
    brands_connected: brandId ? 1 : plan.brandsIncluded,
    members_included: plan.membersIncluded,
    current_period_end: null,
    status: "active",
    stripe_customer_id: null,
    stripe_subscription_id: null,
  } satisfies BillingSummary;
}

export async function getBillingSummaryForUser(params: {
  user: User;
  brandId?: string | null;
}) {
  const { user, brandId = null } = params;
  const brandContext =
    brandId
      ? await getBrandForUser({ brandId, userId: user.id })
      : await ensurePrimaryBrandForUser(user);

  if (!brandContext) {
    throw new Error("Brand workspace not found");
  }

  const billingContext = await ensureBillingAccountForBrand({
    user,
    brand: brandContext.brand,
  });

  if (!billingContext) {
    return getLegacyBillingSummary({ userId: user.id, brandId: brandContext.brand.id });
  }

  const brandsConnected = await getConnectedBrandCount(billingContext.account.id);
  return buildSummaryFromAccount({
    account: billingContext.account,
    brandId: brandContext.brand.id,
    brandsConnected,
  });
}

export async function consumeCredits(params: {
  user: User;
  brandId?: string | null;
  credits: number;
  type: string;
}) {
  const { user, brandId = null, credits, type } = params;
  const brandContext =
    brandId
      ? await getBrandForUser({ brandId, userId: user.id })
      : await ensurePrimaryBrandForUser(user);

  if (!brandContext) {
    throw new Error("Brand workspace not found");
  }

  const billingContext = await ensureBillingAccountForBrand({
    user,
    brand: brandContext.brand,
  });

  if (!billingContext) {
    const { data: usage, error: fetchError } = await supabaseAdmin
      .from("usage_limits")
      .select("credits_used")
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    const nextCreditsUsed = (usage?.credits_used || 0) + credits;

    const { error: updateError } = await supabaseAdmin
      .from("usage_limits")
      .upsert(
        {
          user_id: user.id,
          credits_total: getBillingPlanDefinition("free").creditsIncluded,
          credits_used: nextCreditsUsed,
        },
        { onConflict: "user_id" }
      );

    if (updateError) {
      throw new Error(updateError.message);
    }

    const { error: logError } = await supabaseAdmin.from("usage_logs").insert({
      user_id: user.id,
      type,
      credits_used: credits,
    });

    if (logError) {
      throw new Error(logError.message);
    }

    return getLegacyBillingSummary({ userId: user.id, brandId: brandContext.brand.id });
  }

  const nextCreditsUsed = billingContext.account.credits_used + credits;
  const { data: updatedAccount, error: accountUpdateError } = await supabaseAdmin
    .from("billing_accounts")
    .update({
      credits_used: nextCreditsUsed,
      updated_at: new Date().toISOString(),
    })
    .eq("id", billingContext.account.id)
    .select("*")
    .single();

  if (accountUpdateError || !updatedAccount) {
    throw new Error(accountUpdateError?.message || "Failed to update billing credits");
  }

  const { error: logError } = await supabaseAdmin.from("usage_logs").insert({
    user_id: user.id,
    brand_id: brandContext.brand.id,
    billing_account_id: billingContext.account.id,
    type,
    credits_used: credits,
  });

  if (logError && !isMissingUsageLogColumnError(logError)) {
    throw new Error(logError.message);
  }

  const brandsConnected = await getConnectedBrandCount(updatedAccount.id);
  return buildSummaryFromAccount({
    account: updatedAccount as BillingAccountRecord,
    brandId: brandContext.brand.id,
    brandsConnected,
  });
}

export async function assignPlanToBillingAccount(params: {
  billingAccountId: string;
  planKey: BillingPlanKey;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
  currentPeriodEnd?: string | null;
  status?: string;
}) {
  const { billingAccountId, planKey, stripeCustomerId, stripeSubscriptionId, stripePriceId, currentPeriodEnd, status } = params;
  const plan = getBillingPlanDefinition(planKey);

  const { data: currentAccount, error: currentAccountError } = await supabaseAdmin
    .from("billing_accounts")
    .select("*")
    .eq("id", billingAccountId)
    .single();

  if (currentAccountError || !currentAccount) {
    throw new Error(currentAccountError?.message || "Billing account not found");
  }

  const creditsUsed = Math.min(currentAccount.credits_used || 0, plan.creditsIncluded);

  const { data: updatedAccount, error } = await supabaseAdmin
    .from("billing_accounts")
    .update({
      plan_key: plan.key,
      billing_scope: plan.billingScope,
      status: status || "active",
      credits_total: plan.creditsIncluded,
      credits_used: creditsUsed,
      member_limit: plan.membersIncluded,
      brand_limit: plan.brandsIncluded,
      stripe_customer_id: stripeCustomerId ?? currentAccount.stripe_customer_id,
      stripe_subscription_id: stripeSubscriptionId ?? currentAccount.stripe_subscription_id,
      stripe_price_id: stripePriceId ?? currentAccount.stripe_price_id,
      current_period_end: currentPeriodEnd ?? currentAccount.current_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq("id", billingAccountId)
    .select("*")
    .single();

  if (error || !updatedAccount) {
    throw new Error(error?.message || "Failed to update billing account");
  }

  const brandsConnected = await getConnectedBrandCount(updatedAccount.id);
  return buildSummaryFromAccount({
    account: updatedAccount as BillingAccountRecord,
    brandId: null,
    brandsConnected,
  });
}
