import PricingAction from "@/components/PricingAction";

export default function PricingPage() {
  return (
    <div className="section-space">
      <div className="page-shell">
        <section className="mb-10 text-center">
          <div className="eyebrow">Monetization</div>
          <h1 className="headline mt-6 text-5xl font-black text-white md:text-7xl">
            Public pricing page, upgrade inside the workspace
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/62">
            Anyone can view your plans. Logged-in users can upgrade right here without
            leaving the product flow.
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

            <div className="mt-8 rounded-[1.2rem] border border-white/10 bg-white/6 px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-white/55">
              Available after signup
            </div>
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
              <PricingAction />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
