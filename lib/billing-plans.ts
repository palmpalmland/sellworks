export type BillingPlanKey = "free" | "pro" | "team";

export type BillingPlanDefinition = {
  key: BillingPlanKey;
  label: string;
  monthlyPriceLabel: string;
  brandsIncluded: number;
  membersIncluded: number;
  creditsIncluded: number;
  billingScope: "brand" | "organization";
  sharedCreditPool: boolean;
  stripePriceEnvKey: string | null;
  features: string[];
};

export const BILLING_PLANS: Record<BillingPlanKey, BillingPlanDefinition> = {
  free: {
    key: "free",
    label: "Free",
    monthlyPriceLabel: "$0/mo",
    brandsIncluded: 1,
    membersIncluded: 1,
    creditsIncluded: 100,
    billingScope: "brand",
    sharedCreditPool: false,
    stripePriceEnvKey: null,
    features: [
      "1 brand workspace",
      "1 member",
      "100 monthly credits",
      "Basic copy and image generation",
    ],
  },
  pro: {
    key: "pro",
    label: "Pro",
    monthlyPriceLabel: "$49/mo",
    brandsIncluded: 1,
    membersIncluded: 3,
    creditsIncluded: 1500,
    billingScope: "brand",
    sharedCreditPool: false,
    stripePriceEnvKey: "STRIPE_PRICE_PRO_MONTHLY",
    features: [
      "1 brand workspace",
      "Up to 3 members",
      "1,500 monthly credits",
      "High-quality copy, image, and video generation",
    ],
  },
  team: {
    key: "team",
    label: "Team",
    monthlyPriceLabel: "$149/mo",
    brandsIncluded: 3,
    membersIncluded: 10,
    creditsIncluded: 6000,
    billingScope: "organization",
    sharedCreditPool: true,
    stripePriceEnvKey: "STRIPE_PRICE_TEAM_MONTHLY",
    features: [
      "Up to 3 brand workspaces",
      "Up to 10 members",
      "6,000 shared monthly credits",
      "Shared credit pool across included brands",
    ],
  },
};

export function getBillingPlanDefinition(planKey: string | null | undefined): BillingPlanDefinition {
  if (!planKey) {
    return BILLING_PLANS.free;
  }

  const normalizedKey = planKey.toLowerCase() as BillingPlanKey;
  return BILLING_PLANS[normalizedKey] || BILLING_PLANS.free;
}

