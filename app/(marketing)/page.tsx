import Link from "next/link";

const featureCards = [
  {
    title: "One workflow for copy, offers, and hooks",
    description:
      "Turn a raw product idea into channel-ready messaging for Amazon, Shopify, TikTok Shop, and creator campaigns.",
  },
  {
    title: "Usage, billing, and generation in one product",
    description:
      "You already wired Supabase and Stripe. Now the front end finally looks like the premium AI engine behind it.",
  },
  {
    title: "Built for fast launch loops",
    description:
      "Ship pages, test conversion, tweak pricing, and keep learning from real usage instead of staying in MVP mode.",
  },
];

const categories = [
  {
    title: "Amazon sellers",
    description: "Listing copy, bullets, and offer framing for marketplace conversion.",
  },
  {
    title: "Shopify brands",
    description: "Landing-page angles and product storytelling for direct-response PDPs.",
  },
  {
    title: "TikTok shops",
    description: "Hooks, creator-style scripts, and fast variants for testing paid ideas.",
  },
];

const workflow = [
  "Paste a product angle or describe the offer",
  "Generate platform-specific messaging in seconds",
  "Track usage and plan status from one dashboard",
];

export default function HomePage() {
  return (
    <div>
      <section id="overview" className="section-space overflow-hidden pt-10 md:pt-16 scroll-mt-28">
        <div className="page-shell">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-10">
            <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
              <div className="space-y-8">
                <div className="eyebrow">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  AI Content System for sellers
                </div>

                <div className="space-y-6">
                  <h1 className="headline text-5xl font-black leading-none text-white md:text-7xl">
                    Turn one product brief into a{" "}
                    <span className="gradient-text">real content engine</span>
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-white/68 md:text-xl">
                    Launch better product copy, faster campaign iterations, and a cleaner
                    upgrade path. This is your AI SaaS front end rebuilt to feel premium,
                    sharp, and conversion-ready.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link href="/login" className="cta-primary">
                    Start Free
                  </Link>
                  <Link href="/pricing" className="cta-secondary">
                    View Pricing
                  </Link>
                </div>

                <div className="grid gap-4 text-sm text-white/55 sm:grid-cols-3">
                  <div className="panel rounded-[1.6rem] p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-white/35">Output</div>
                    <div className="mt-2 text-lg font-bold text-white">Copy-first AI</div>
                  </div>
                  <div className="panel rounded-[1.6rem] p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-white/35">Billing</div>
                    <div className="mt-2 text-lg font-bold text-white">Stripe ready</div>
                  </div>
                  <div className="panel rounded-[1.6rem] p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-white/35">Data</div>
                    <div className="mt-2 text-lg font-bold text-white">Supabase backed</div>
                  </div>
                </div>
              </div>

              <div className="panel-strong relative rounded-[2rem] p-5 md:p-7">
                <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top_right,rgba(50,200,255,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(156,107,255,0.16),transparent_34%)]" />
                <div className="relative space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.22em] text-cyan-300/70">
                        Sample generation flow
                      </div>
                      <div className="headline mt-2 text-2xl font-black text-white">
                        Engine Preview
                      </div>
                    </div>
                    <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                      Live
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                    <div className="text-sm text-white/48">Input</div>
                    <div className="mt-2 text-lg font-semibold text-white">
                      Premium portable blender for TikTok Shop
                    </div>
                    <div className="mt-4 space-y-3 text-sm text-white/60">
                      <div className="rounded-2xl bg-white/5 px-4 py-3">
                        Angle: compact, giftable, post-gym lifestyle
                      </div>
                      <div className="rounded-2xl bg-white/5 px-4 py-3">
                        Output target: hook, bullets, PDP copy, paid ad variant
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-indigo-400/20 bg-indigo-500/10 p-5">
                    <div className="text-sm uppercase tracking-[0.18em] text-indigo-200/72">
                      Output
                    </div>
                    <div className="mt-3 space-y-3 text-sm text-white/72">
                      <div className="rounded-2xl bg-white/6 px-4 py-3">
                        Hook: Blend anywhere. Sell the glow-up, not the appliance.
                      </div>
                      <div className="rounded-2xl bg-white/6 px-4 py-3">
                        Bullet stack: portability, cleanup speed, gifting angle, creator-ready copy.
                      </div>
                      <div className="rounded-2xl bg-white/6 px-4 py-3">
                        Monetization: free credits to paid monthly upgrade.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="page-shell">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-10">
            <div className="panel rounded-[2rem] px-6 py-5 md:px-8">
              <div className="grid gap-5 text-sm uppercase tracking-[0.24em] text-white/42 md:grid-cols-4">
                <div>Amazon listing copy</div>
                <div>Shopify landing angles</div>
                <div>TikTok hooks and scripts</div>
                <div>Plan + usage orchestration</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="section-space scroll-mt-28">
        <div className="page-shell">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-10">
          <div className="mb-12 max-w-3xl space-y-4">
            <div className="eyebrow">Why this front end now fits the product</div>
            <h2 className="headline text-4xl font-black text-white md:text-6xl">
              A sharper UI for a product that is already working
            </h2>
            <p className="text-lg leading-8 text-white/62">
              Your backend flow is already there. The goal of this redesign is to make
              the experience look trustworthy, focused, and worth paying for.
            </p>
          </div>

          <div className="card-grid md:grid-cols-3">
            {featureCards.map((item) => (
              <div key={item.title} className="panel rounded-[2rem] p-7">
                <div className="mb-5 h-12 w-12 rounded-2xl bg-[linear-gradient(135deg,rgba(50,200,255,0.22),rgba(109,124,255,0.28))]" />
                <h3 className="headline text-2xl font-black text-white">
                  {item.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-white/58">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      <section id="categories" className="section-space scroll-mt-28">
        <div className="page-shell">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-10">
            <div className="mb-12 max-w-3xl space-y-4">
              <div className="eyebrow">Categories</div>
              <h2 className="headline text-4xl font-black text-white md:text-6xl">
                Built for the main ecommerce content loops
              </h2>
              <p className="text-lg leading-8 text-white/62">
                The front site should explain the product by audience, not only by features.
              </p>
            </div>

            <div className="card-grid md:grid-cols-3">
              {categories.map((item) => (
                <div key={item.title} className="panel rounded-[2rem] p-7">
                  <div className="text-xs uppercase tracking-[0.22em] text-cyan-300/70">
                    Category
                  </div>
                  <h3 className="headline mt-4 text-2xl font-black text-white">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-white/58">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="page-shell">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="panel rounded-[2rem] p-8 md:p-10">
            <div className="eyebrow">Workflow</div>
            <h2 className="headline mt-6 text-4xl font-black text-white">
              From prompt to paid plan in one clean path
            </h2>
            <div className="mt-8 space-y-4">
              {workflow.map((step, index) => (
                <div
                  key={step}
                  className="flex items-start gap-4 rounded-[1.5rem] border border-white/8 bg-white/4 p-4"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 font-black text-white">
                    {index + 1}
                  </div>
                  <div className="pt-1 text-base text-white/72">{step}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-strong rounded-[2rem] p-8 md:p-10">
            <div className="eyebrow">Workspace only after signup</div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="panel rounded-[1.6rem] p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-white/35">Public</div>
                <div className="headline mt-3 text-2xl font-black text-white">Home + Pricing</div>
                <p className="mt-3 text-sm leading-6 text-white/56">
                  These pages explain what the product does before people create an account.
                </p>
              </div>
              <div className="panel rounded-[1.6rem] p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-white/35">Private</div>
                <div className="headline mt-3 text-2xl font-black text-white">Workspace</div>
                <p className="mt-3 text-sm leading-6 text-white/56">
                  Dashboard, generation, and history live behind login in a separate shell.
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="section-space scroll-mt-28">
        <div className="page-shell">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-10">
            <div className="mb-12 max-w-3xl space-y-4">
              <div className="eyebrow">Pricing preview</div>
              <h2 className="headline text-4xl font-black text-white md:text-6xl">
                Start free, upgrade later
              </h2>
              <p className="text-lg leading-8 text-white/62">
                Pricing is public for discovery. Actual upgrade actions are available after login.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="panel rounded-[2rem] p-8">
                <div className="text-xs uppercase tracking-[0.22em] text-white/36">Free</div>
                <div className="headline mt-4 text-4xl font-black text-white">$0</div>
                <p className="mt-4 text-white/60">Use the workspace, test the flow, and validate demand.</p>
              </div>
              <div className="panel-strong rounded-[2rem] p-8">
                <div className="text-xs uppercase tracking-[0.22em] text-cyan-300/76">Pro</div>
                <div className="headline mt-4 text-4xl font-black text-white">$9.99/mo</div>
                <p className="mt-4 text-white/60">More credits and a cleaner paid path once users are ready.</p>
                <div className="mt-6">
                  <Link href="/pricing" className="cta-primary text-sm">
                    Full Pricing Page
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
