import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import MarketingUpgradeBar from "@/components/MarketingUpgradeBar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketingNav />
      <main className="pt-24 md:pt-28">{children}</main>
      <MarketingUpgradeBar />
      <MarketingFooter />
    </>
  );
}
