import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "AI Content Factory",
  description: "AI tools for e-commerce and creators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">
        <header className="border-b border-gray-800 px-6 py-4">
          <nav className="flex gap-6">
            <Link href="/">Home</Link>
            <Link href="/login">Login</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/generate">Generate</Link>
            <Link href="/history">History</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}