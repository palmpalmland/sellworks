import PricingAction from "@/components/PricingAction";

const plans = [
  {
    name: "Free",
    price: "$0",
    suffix: "/mo",
    subtitle: "For solo testing",
    items: ["1 brand workspace", "1 member", "100 monthly credits", "Basic copy and image generation"],
    cta: "Start Free",
    highlight: false,
    kind: "public",
  },
  {
    name: "Pro",
    price: "$49",
    suffix: "/mo",
    subtitle: "For single-brand sellers",
    items: ["1 brand workspace", "Up to 3 members", "1,500 monthly credits", "Copy, image, and video generation"],
    cta: "Upgrade to Pro",
    highlight: false,
    kind: "upgrade",
  },
  {
    name: "Team",
    price: "$149",
    suffix: "/mo",
    subtitle: "Shared billing for multi-brand teams",
    items: ["3 brand workspaces", "Up to 10 members", "6,000 shared monthly credits", "Shared credit pool across brands"],
    cta: "Upgrade to Team",
    highlight: true,
    kind: "upgrade",
  },
  {
    name: "Custom",
    price: "Custom",
    suffix: "",
    subtitle: "For high-volume brands",
    items: ["Unlimited kits (fair use)", "API access", "White-label options", "Priority support"],
    cta: "Contact Us",
    highlight: false,
    kind: "contact",
  },
];

function CheckIcon() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/18 text-cyan-300">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-3 w-3">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}

export default function PricingPage() {
  return (
    <div className="section-space">
      <div className="page-shell">
        <section className="mb-12 text-center">
          <div className="eyebrow">Simple, Transparent Pricing</div>
          <h1 className="headline mt-6 text-5xl font-black text-white md:text-7xl">
            High-volume content.
            <br />
            <span className="gradient-text">Low cost.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/62">
            Public pricing makes discovery easy. Logged-in users can still upgrade from
            inside the workspace when they&apos;re ready.
          </p>
        </section>

        <section className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.highlight
                  ? "panel-strong relative flex min-h-[30rem] flex-col rounded-[2rem] border border-[#6C5CE7]/40 bg-[#6C5CE7]/5 p-9 shadow-[0_0_50px_rgba(108,92,231,0.14)]"
                  : "panel flex min-h-[30rem] flex-col rounded-[2rem] p-9"
              }
            >
              {plan.highlight ? (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#6C5CE7] px-4 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                  Most Popular
                </div>
              ) : null}

              <div className="mb-8">
                <h2 className="headline text-2xl font-black text-white">{plan.name}</h2>
                <div className="mt-5 flex items-end gap-1 text-white">
                  <span className="headline text-6xl font-black tracking-tight">{plan.price}</span>
                  {plan.suffix ? <span className="pb-2 text-lg font-semibold text-white/40">{plan.suffix}</span> : null}
                </div>
                <p className="mt-4 text-sm leading-7 text-white/52">{plan.subtitle}</p>
              </div>

              <div className="flex-1 space-y-5">
                {plan.items.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-lg font-medium text-white/78">
                    <CheckIcon />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                {plan.kind === "upgrade" ? (
                  <PricingAction
                    planKey={plan.name.toLowerCase() === "team" ? "team" : "pro"}
                    label={plan.cta}
                  />
                ) : plan.kind === "contact" ? (
                  <a
                    href="mailto:hello@sellworks.ai"
                    className="inline-flex w-full items-center justify-center rounded-[1.2rem] border border-white/8 bg-white/6 px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <div className="inline-flex w-full items-center justify-center rounded-[1.2rem] border border-white/8 bg-white/6 px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-white">
                    {plan.cta}
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
