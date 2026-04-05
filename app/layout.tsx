import "./globals.css";
import { Manrope, Space_Grotesk } from "next/font/google";
import Navbar from "@/components/NavBar";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

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
      <body className={`${manrope.variable} ${spaceGrotesk.variable}`}>
        <div className="app-shell">
          <Navbar />
          <main className="pt-24 md:pt-28">{children}</main>
        </div>
      </body>
    </html>
  );
}
