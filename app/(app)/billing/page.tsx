import UpgradeButton from "@/components/UpgradeButton";

export default function BillingPage() {
  return (
    <main className="space-y-6 py-2">
      <section className="panel-strong rounded-[2.2rem] p-8 md:p-10">
        <div className="eyebrow">Workspace pricing</div>
        <h1 className="headline mt-6 text-4xl font-black text-white md:text-6xl">
          Manage plan without leaving the workspace
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/62">
          This page is the backend-side pricing view. You stay inside the operator shell while upgrading.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="panel rounded-[2rem] p-8">
          <div className="text-xs uppercase tracking-[0.22em] text-white/36">Free</div>
          <div className="headline mt-4 text-4xl font-black text-white">$0</div>
          <div className="mt-6 space-y-4 text-white/62">
            <p>Entry access to the workspace.</p>
            <p>Enough to test the product and try a few generations.</p>
          </div>
        </div>

        <div className="panel-strong rounded-[2rem] p-8">
          <div className="text-xs uppercase tracking-[0.22em] text-cyan-300/76">Pro</div>
          <div className="headline mt-4 text-4xl font-black text-white">$9.99/mo</div>
          <div className="mt-6 space-y-4 text-white/68">
            <p>More monthly credits.</p>
            <p>Better fit for repeated usage and real customer testing.</p>
          </div>
          <div className="mt-8">
            <UpgradeButton />
          </div>
        </div>
      </section>
    </main>
  );
}
