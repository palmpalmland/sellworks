import UpgradeButton from "@/components/UpgradeButton";

export default function PricingPage() {
  return (
    <div className="section-space">
      <div className="page-shell">
        <section className="mb-10 text-center">
          <div className="eyebrow">Monetization</div>
          <h1 className="headline mt-6 text-5xl font-black text-white md:text-7xl">
            Simple pricing for testing, learning, and scaling
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/62">
            Keep the free entry point for fast onboarding, then move users into a clear
            paid path when they need more generation capacity.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="panel rounded-[2.2rem] p-8 md:p-10">
            <div className="text-xs uppercase tracking-[0.24em] text-white/38">Free</div>
            <h2 className="headline mt-4 text-3xl font-black text-white">Validate demand first</h2>
            <div className="mt-5 text-6xl font-black text-white">
              $0<span className="ml-2 text-lg font-semibold text-white/40">forever</span>
            </div>

            <div className="mt-8 space-y-4 text-white/66">
              <div className="rounded-[1.4rem] border border-white/8 bg-white/5 px-4 py-4">
                1000 credits included
              </div>
              <div className="rounded-[1.4rem] border border-white/8 bg-white/5 px-4 py-4">
                Great for testing the workflow and first user feedback
              </div>
              <div className="rounded-[1.4rem] border border-white/8 bg-white/5 px-4 py-4">
                Basic access to content generation
              </div>
            </div>

            <button
              className="mt-8 w-full rounded-[1.2rem] border border-white/10 bg-white/6 px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white/55"
              disabled
            >
              Current free plan
            </button>
          </div>

          <div className="panel-strong relative rounded-[2.2rem] p-8 md:p-10">
            <div className="absolute right-8 top-8 rounded-full border border-indigo-300/20 bg-indigo-400/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-indigo-100">
              Most popular
            </div>
            <div className="text-xs uppercase tracking-[0.24em] text-cyan-300/76">Pro</div>
            <h2 className="headline mt-4 text-3xl font-black text-white">Ship with room to grow</h2>
            <div className="mt-5 text-6xl font-black text-white">
              $9.99<span className="ml-2 text-lg font-semibold text-white/40">/month</span>
            </div>

            <div className="mt-8 space-y-4 text-white/70">
              <div className="rounded-[1.4rem] border border-indigo-300/16 bg-indigo-400/8 px-4 py-4">
                10000 credits per month
              </div>
              <div className="rounded-[1.4rem] border border-white/8 bg-white/5 px-4 py-4">
                Better fit for repeated generation and live user testing
              </div>
              <div className="rounded-[1.4rem] border border-white/8 bg-white/5 px-4 py-4">
                Continue generating without interruption
              </div>
            </div>

            <div className="mt-8">
              <UpgradeButton />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="panel rounded-[2rem] p-8">
            <h3 className="headline text-3xl font-black text-white">
              What happens after payment
            </h3>
            <div className="mt-6 space-y-4 text-base leading-7 text-white/62">
              <p>Your credits are added after a successful Stripe checkout.</p>
              <p>You can immediately continue generating content in the same account.</p>
              <p>Your dashboard will reflect the updated plan and remaining credits.</p>
            </div>
          </div>

          <div className="panel rounded-[2rem] p-8">
            <div className="text-xs uppercase tracking-[0.22em] text-white/36">Launch tip</div>
            <p className="mt-4 text-lg leading-8 text-white/62">
              Keep this page simple while you validate conversion. If users hesitate,
              you can later test annual plans, team seats, or higher generation bundles.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
