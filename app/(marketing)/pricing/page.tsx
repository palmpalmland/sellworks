import PricingAction from "@/components/PricingAction";

const plans = [
  {
    name: "Free",
    price: "$0",
    subtitle: "Try Sellworks for free",
    items: ["1 product kit", "Standard resolution", "Basic support"],
    highlight: false,
  },
  {
    name: "Starter",
    price: "$19",
    subtitle: "For small sellers",
    items: ["10 product kits", "High resolution", "Priority support", "No watermarks"],
    highlight: false,
  },
  {
    name: "Growth",
    price: "$49",
    subtitle: "Our most popular plan",
    items: ["50 product kits", "4K resolution", "Dedicated account manager", "Custom branding"],
    highlight: true,
  },
  {
    name: "Scale",
    price: "$99",
    subtitle: "For high-volume brands",
    items: ["Unlimited kits (fair use)", "API access", "White-label options", "24/7 support"],
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="section-space">
      <div className="page-shell">
        <section className="mb-10 text-center">
          <div className="eyebrow">Simple, Transparent Pricing</div>
          <h1 className="headline mt-6 text-5xl font-black text-white md:text-7xl">
            High-volume content.
            <br />
            <span className="gradient-text">Low cost.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/62">
            Sellworks pricing stays public for discovery. Logged-in users can still
            upgrade without leaving the product flow.
          </p>
        </section>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.highlight
                  ? "panel-strong relative flex flex-col rounded-[2rem] border border-[#6C5CE7]/50 bg-[#6C5CE7]/5 p-8 shadow-[0_0_50px_rgba(108,92,231,0.15)]"
                  : "panel flex flex-col rounded-[2rem] p-8"
              }
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#6C5CE7] px-4 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h2 className="headline text-2xl font-black text-white">{plan.name}</h2>
                <div className="mt-5 text-6xl font-black text-white">
                  {plan.price}
                  <span className="ml-2 text-lg font-semibold text-white/40">/month</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-white/56">{plan.subtitle}</p>
              </div>

              <div className="flex-1 space-y-4 text-white/70">
                {plan.items.map((item) => (
                  <div key={item} className="rounded-[1.4rem] border border-white/8 bg-white/5 px-4 py-4">
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8">
                {plan.highlight ? (
                  <PricingAction />
                ) : (
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/6 px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-white/55">
                    Available after signup
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
