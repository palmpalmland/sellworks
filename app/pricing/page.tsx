import UpgradeButton from "@/components/UpgradeButton";

export default function PricingPage() {
  return (
    <main className="min-h-screen px-8 py-12 text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">Simple pricing</h1>
        <p className="text-lg text-gray-300 mb-12">
          Start free, then upgrade when you need more credits.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-gray-700 p-8">
            <h2 className="text-2xl font-bold mb-2">Free</h2>
            <p className="text-4xl font-bold mb-6">$0</p>

            <div className="space-y-3 text-gray-300 mb-8">
              <p>1000 credits included</p>
              <p>Basic access to generate content</p>
              <p>Good for testing the product</p>
            </div>

            <button
              className="w-full rounded-xl bg-gray-700 px-4 py-3 text-white cursor-not-allowed"
              disabled
            >
              Current free plan
            </button>
          </div>

          <div className="rounded-2xl border border-white p-8">
            <p className="inline-block rounded-full bg-white text-black px-3 py-1 text-sm font-semibold mb-4">
              Most Popular
            </p>

            <h2 className="text-2xl font-bold mb-2">Pro</h2>
            <p className="text-4xl font-bold mb-6">
              $9.99<span className="text-lg font-normal">/month</span>
            </p>

            <div className="space-y-3 text-gray-300 mb-8">
              <p>10000 credits per month</p>
              <p>More generation capacity</p>
              <p>Best for real usage</p>
              <p>Continue generating without interruption</p>
            </div>

            <UpgradeButton />
          </div>
        </div>

        <div className="mt-14 rounded-2xl border border-gray-700 p-8">
          <h3 className="text-2xl font-bold mb-4">What happens after purchase?</h3>
          <div className="space-y-3 text-gray-300">
            <p>Your credits are added to your account after successful payment.</p>
            <p>You can immediately continue generating content.</p>
            <p>Your dashboard will show your updated plan and remaining credits.</p>
          </div>
        </div>
      </div>
    </main>
  );
}