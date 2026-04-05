import MarketingNav from "@/components/MarketingNav";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketingNav />
      <main className="pt-24 md:pt-28">{children}</main>
    </>
  );
}
