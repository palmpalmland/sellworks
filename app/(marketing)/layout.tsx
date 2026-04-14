import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import MarketingUpgradeBar from "@/components/MarketingUpgradeBar";
import MarketingThemeLock from "@/components/MarketingThemeLock";
import { MarketingAuthProvider } from "@/components/MarketingAuth";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MarketingAuthProvider>
      <div className="marketing-light min-h-screen">
        <MarketingThemeLock />
        <MarketingNav />
        <main className="pt-24 md:pt-28">{children}</main>
        <MarketingUpgradeBar />
        <MarketingFooter />
      </div>
    </MarketingAuthProvider>
  );
}
