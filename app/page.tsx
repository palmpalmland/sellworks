import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-4">AI Content Factory</h1>
      <p className="text-lg mb-6">
        Generate product copy, images, and marketing content for e-commerce and creators.
      </p>

      <div className="flex gap-4">
        <Link href="/login" className="rounded-lg bg-black text-white px-4 py-2">
          Login
        </Link>
        <Link href="/generate" className="rounded-lg border px-4 py-2">
          Try Generator
        </Link>
      </div>
    </main>
  );
}