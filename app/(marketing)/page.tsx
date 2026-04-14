'use client'

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import MarketingLoadingOverlay from "@/components/MarketingLoadingOverlay";
import Reveal from "@/components/Reveal";
import { marketingDemo } from "@/lib/demo-content";
import { useMarketingAuth } from "@/components/MarketingAuth";

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
      <path d="m16 13 5.2 3.5a.5.5 0 0 0 .8-.4V7.9a.5.5 0 0 0-.8-.4L16 10.5" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
      <path d="M4 14a1 1 0 0 1-.8-1.6l9.9-10.2a.5.5 0 0 1 .9.5l-1.9 6A1 1 0 0 0 13 10h7a1 1 0 0 1 .8 1.6l-9.9 10.2a.5.5 0 0 1-.9-.5l1.9-6A1 1 0 0 0 11 14z" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
      <path d="M3 3v18h18" />
      <path d="M7 16v-4" />
      <path d="M12 16V8" />
      <path d="M17 16v-7" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
      <path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Z" />
      <path d="m3 12 9 4.5 9-4.5" />
      <path d="m3 16.5 9 4.5 9-4.5" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

const features = [
  {
    title: "Product Listing Copy",
    description: "SEO-optimized titles, bullets, and descriptions that rank and convert.",
    icon: <FileIcon />,
    accent: "text-[#6C5CE7]",
  },
  {
    title: "Amazon-Ready Images",
    description: "High-quality white background and lifestyle visuals generated instantly.",
    icon: <ImageIcon />,
    accent: "text-[#00D4FF]",
  },
  {
    title: "TikTok Ad Creatives",
    description: "Scroll-stopping video ads with hooks and UGC-style formatting.",
    icon: <VideoIcon />,
    accent: "text-[#6C5CE7]",
  },
  {
    title: "Multiple Hook Variations",
    description: "Test different angles to find what resonates with your audience.",
    icon: <ZapIcon />,
    accent: "text-[#00D4FF]",
  },
];

const outputs = [
  {
    title: "Video",
    description:
      "Generate scroll-stopping TikTok-style ads with hooks, captions, and UGC formatting.",
    icon: <VideoIcon />,
    accent: "border-[#6C5CE7]/20 bg-[#6C5CE7]/10 text-[#6C5CE7]",
  },
  {
    title: "Images",
    description:
      "Create Amazon-ready images, lifestyle visuals, and ad creatives instantly.",
    icon: <ImageIcon />,
    accent: "border-[#00D4FF]/20 bg-[#00D4FF]/10 text-[#00D4FF]",
  },
  {
    title: "Copy",
    description:
      "Get titles, bullet points, descriptions, and ad hooks optimized for conversion.",
    icon: <FileIcon />,
    accent: "border-[#6C5CE7]/20 bg-[#6C5CE7]/10 text-[#6C5CE7]",
  },
];

const reasons = [
  {
    title: "Launch products faster",
    description: "Go from idea to live listing in minutes, not weeks.",
    icon: <RocketIcon />,
  },
  {
    title: "Increase conversion rates",
    description: "Built around content formats that actually move shoppers to buy.",
    icon: <BarChartIcon />,
  },
  {
    title: "Replace tool sprawl",
    description: "Stop bouncing between copy tools, image editors, and freelance workflows.",
    icon: <LayersIcon />,
  },
  {
    title: "Stay on-brand at scale",
    description: "Generate repeatable output systems instead of one-off creative experiments.",
    icon: <ZapIcon />,
  },
];

const comparisonRows = [
  { label: "Full content kit", sellworks: true, others: false },
  { label: "Built for ecommerce", sellworks: true, others: false },
  { label: "Lower cost", sellworks: true, others: false },
  { label: "Multiple variations", sellworks: true, others: false },
  { label: "Single asset generation", sellworks: false, others: true },
];

const processSteps = [
  {
    number: "01",
    title: "Paste your product link",
    description: "Simply drop a link from Amazon, Shopify, or TikTok Shop into our AI engine.",
  },
  {
    number: "02",
    title: "Sellworks generates your kit",
    description: "Our AI analyzes the product and generates your entire content system in seconds.",
  },
  {
    number: "03",
    title: "Export and use across platforms",
    description: "Download your high-res images, videos, and copy to launch your ads instantly.",
  },
];

const showcase = [
  { label: "Content Kit", title: "Portable Blender", image: "https://picsum.photos/seed/blender/400/400" },
  { label: "TikTok Ad", title: "Ergonomic Chair", image: "https://picsum.photos/seed/chair/400/400" },
  { label: "Amazon Listing", title: "Smart Watch", image: "https://picsum.photos/seed/watch/400/400" },
  { label: "UGC Video", title: "Coffee Maker", image: "https://picsum.photos/seed/coffee/400/400" },
];

export default function HomePage() {
  const [demoInput, setDemoInput] = useState("");
  const [demoState, setDemoState] = useState<"idle" | "loading" | "results">("idle");
  const resultsRef = useRef<HTMLElement | null>(null);
  const { openAuth } = useMarketingAuth();

  const runDemo = useCallback((nextValue?: string) => {
    if (nextValue) {
      setDemoInput(nextValue);
    }
    setDemoState("loading");
  }, []);

  const handleDemoComplete = useCallback(() => {
    setDemoState("results");
    window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }, []);

  return (
    <div className="selection:bg-[#6C5CE7]/20">
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 py-28 md:py-32">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-[#6C5CE7]/7 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-[#00D4FF]/6 blur-[120px]" />
          <div className="absolute left-1/2 top-[20%] h-[800px] w-full -translate-x-1/2 bg-[radial-gradient(circle_at_50%_0%,rgba(108,92,231,0.045)_0%,transparent_70%)]" />
        </div>

        <Reveal className="mx-auto max-w-5xl text-center" variant="fade-up">
          <div className="theme-surface mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-[#6C5CE7]" />
            <span className="theme-text-muted">New: TikTok Shop Integration Live</span>
          </div>

          <h1 className="headline theme-text text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
            Turn any product into{" "}
            <span className="gradient-text-spotlight">revenue.</span>
          </h1>

          <p className="theme-text mx-auto mt-6 max-w-2xl text-2xl font-semibold leading-relaxed sm:text-3xl">
            No skills needed.{" "}
            <span className="gradient-text">Sell like a pro.</span>
          </p>

          <p className="theme-text-muted mx-auto mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl">
            Sellworks analyzes your product and generates everything you need to sell:
            Amazon-ready images, TikTok ads, and conversion-optimized copy.
          </p>

          <Reveal className="mx-auto mt-16 w-full max-w-3xl" variant="pop-in" delayMs={180}>
            <div className="panel-strong group relative flex flex-col gap-4 rounded-[2rem] p-5 transition-all duration-500 hover:border-[color:var(--border)] hover:shadow-[0_0_50px_rgba(108,92,231,0.08)] sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center theme-text-muted">
                  <LinkIcon />
                </div>
                <input
                  placeholder={marketingDemo.inputPlaceholder}
                  className="field h-16 rounded-2xl pl-14 pr-4"
                  type="text"
                  value={demoInput}
                  onChange={(event) => setDemoInput(event.target.value)}
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="theme-surface theme-text flex h-16 items-center gap-2 rounded-2xl border px-6 font-semibold">
                  <ImageIcon />
                  <span className="hidden sm:inline">Upload</span>
                </div>
                <button
                  type="button"
                  onClick={() => runDemo(demoInput || marketingDemo.exampleUrl)}
                  className="flex h-16 items-center gap-3 rounded-2xl bg-[linear-gradient(135deg,#6C5CE7_0%,#00D4FF_100%)] px-10 font-bold text-white shadow-[0_12px_30px_rgba(108,92,231,0.14)]"
                >
                  <span>Generate</span>
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="theme-text-muted text-sm">No link?</span>
              <button
                type="button"
                onClick={() => runDemo(marketingDemo.exampleUrl)}
                className="text-sm font-bold text-[#6C5CE7] transition-colors hover:text-[#00D4FF] underline underline-offset-4"
              >
                Try an example product
              </button>
            </div>

            <div className="theme-text-muted mt-10 flex items-center justify-center gap-8 text-sm font-bold uppercase tracking-[0.2em]">
              <span>Amazon</span>
              <span>Shopify</span>
              <span>TikTok Shop</span>
              <span>Meta</span>
            </div>
          </Reveal>
        </Reveal>
      </section>

      <section id="product" className="section-space scroll-mt-28">
        <div className="page-shell">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6C5CE7]/20 bg-[#6C5CE7]/10 px-4 py-1 text-sm font-bold text-[#6C5CE7]">
              The Sellworks Advantage
            </div>
            <h2 className="headline theme-text text-4xl font-black tracking-tight sm:text-6xl">
              From one product link to a
              <br />
              <span className="gradient-text">full content kit</span>
            </h2>
            <p className="theme-text-muted mx-auto mt-6 max-w-2xl text-lg leading-relaxed">
              Most tools generate one asset at a time. Sellworks analyzes your product and
              generates your entire marketing system in seconds.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((item, index) => (
              <Reveal
                key={item.title}
                className="panel group rounded-[2rem] p-8 transition-all duration-500 hover:bg-[color:var(--menu-item-bg)] hover:border-[color:var(--border)]"
                variant="pop-in"
                delayMs={100 + index * 90}
              >
                <div className="theme-surface mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-500 group-hover:border-[#6C5CE7]/30 group-hover:bg-[#6C5CE7]/10">
                  <div className={item.accent}>{item.icon}</div>
                </div>
                <h3 className="headline theme-text text-xl font-black tracking-tight">{item.title}</h3>
                <p className="theme-text-muted mt-3 text-sm leading-relaxed transition-colors group-hover:text-[color:var(--foreground)]">
                  {item.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" ref={resultsRef} className="section-space scroll-mt-28">
        <div className="page-shell">
          {demoState === "results" ? (
            <>
              <div className="mb-16 text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1 text-sm font-bold text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  {marketingDemo.resultLabel}
                </div>
                <h2 className="headline theme-text text-4xl font-black tracking-tight sm:text-6xl">
                  {marketingDemo.resultTitle}
                </h2>
                <p className="theme-text-muted mt-4 text-lg">
                  {marketingDemo.resultSubtitle}
                </p>
              </div>

              <div className="grid gap-10">
                <Reveal className="panel-strong overflow-hidden rounded-[2rem]" variant="pop-in">
                  <div className="grid gap-10 p-8 lg:grid-cols-[0.92fr_1.08fr]">
                    <div className="mx-auto w-full max-w-[340px] rounded-[32px] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(108,92,231,0.12),rgba(255,255,255,0.45))] p-5 shadow-xl">
                      <div className="flex h-full min-h-[610px] flex-col justify-between overflow-hidden rounded-[28px] bg-white/35">
                        <div className="relative aspect-[9/16] overflow-hidden rounded-[28px] border border-[color:var(--border)]">
                          <img
                            src={marketingDemo.video.poster}
                            alt="Sellworks demo video poster"
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute left-4 top-4 flex gap-2">
                            <span className="rounded-full bg-[#6C5CE7] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                              {marketingDemo.video.badge}
                            </span>
                            <span className="rounded-full border border-[color:var(--border)] bg-white/70 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] theme-text">
                              {marketingDemo.video.format}
                            </span>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/50 bg-white/60 backdrop-blur-md">
                              <div className="ml-1 h-0 w-0 border-y-[14px] border-l-[22px] border-y-transparent border-l-[#111827]" />
                            </div>
                          </div>
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/80 to-transparent p-6">
                            <h4 className="theme-text text-sm font-bold leading-relaxed">
                              {marketingDemo.video.headline}
                            </h4>
                            <div className="theme-text-muted mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]">
                              <ZapIcon />
                              <span>High-Res Export Locked</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-2">
                      <Reveal className="panel rounded-[2rem] p-8" variant="slide-left" delayMs={220}>
                        <div className="mb-6 flex items-center justify-between">
                          <h3 className="headline theme-text text-xl font-black">Product Copy</h3>
                          <div className="theme-surface theme-text rounded-xl border px-4 py-2 text-sm font-medium">
                            Copy All
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div>
                            <label className="theme-text-muted mb-2 block text-xs font-bold uppercase tracking-[0.18em]">Product Title</label>
                            <p className="theme-text text-lg font-semibold leading-tight">
                              {marketingDemo.copy.title}
                            </p>
                          </div>
                          <div>
                            <label className="theme-text-muted mb-2 block text-xs font-bold uppercase tracking-[0.18em]">Key Features</label>
                            <ul className="theme-text space-y-2 text-sm">
                              {marketingDemo.copy.bullets.map((bullet) => (
                                <li key={bullet}>{bullet}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <label className="theme-text-muted mb-2 block text-xs font-bold uppercase tracking-[0.18em]">Description</label>
                            <p className="theme-text-muted text-sm leading-7">
                              {marketingDemo.copy.description}
                            </p>
                          </div>
                        </div>
                      </Reveal>

                      <Reveal className="panel rounded-[2rem] p-8" variant="slide-right" delayMs={320}>
                        <div className="theme-text-muted mb-6 text-xs font-black uppercase tracking-[0.18em]">
                          Generated Assets
                        </div>
                        <div className="space-y-4">
                          {marketingDemo.generatedAssets.map((asset) => (
                            <div key={asset.title} className="theme-surface rounded-[1.4rem] border p-5">
                              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6C5CE7]">
                                {asset.label}
                              </div>
                              <div className="theme-text mt-2 text-lg font-bold">{asset.title}</div>
                            </div>
                          ))}
                        </div>
                      </Reveal>
                    </div>
                  </div>

                  <div className="theme-surface flex flex-col gap-4 border-t p-8 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-[#111827] px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-white">
                        Download
                      </div>
                      <div className="theme-text rounded-2xl border border-[color:var(--border)] bg-white/60 px-6 py-3 text-sm font-black uppercase tracking-[0.18em]">
                        Remix
                      </div>
                    </div>
                    <div className="theme-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
                      {marketingDemo.video.note}
                    </div>
                  </div>
                </Reveal>

                <div className="grid gap-8 md:grid-cols-3">
                  {marketingDemo.images.map((image, index) => (
                    <Reveal
                      key={image.title}
                      className="panel overflow-hidden rounded-[2rem]"
                      variant="pop-in"
                      delayMs={180 + index * 100}
                    >
                      <div className="aspect-square overflow-hidden border-b border-[color:var(--border)] bg-white/30">
                        <img
                          src={image.src}
                          alt={image.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6C5CE7]">
                          {image.label}
                        </div>
                        <div className="theme-text mt-2 text-xl font-black tracking-tight">
                          {image.title}
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-16 text-center">
                <h2 className="headline theme-text text-4xl font-black tracking-tight sm:text-6xl">
                  See Sellworks in action
                </h2>
                <p className="theme-text-muted mt-6 text-lg">
                  Paste a link above to see the magic happen.
                </p>
              </div>
              <Reveal
                className="panel group relative flex aspect-video items-center justify-center overflow-hidden rounded-[2rem] border-dashed border-[color:var(--border)] bg-white/30 transition-all duration-500 hover:border-[color:var(--muted)]"
                variant="pop-in"
                delayMs={120}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(108,92,231,0.05)_0%,transparent_70%)]" />
                <div className="theme-text-muted relative flex flex-col items-center gap-4 transition-colors group-hover:text-[color:var(--foreground)]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-current animate-[spin_10s_linear_infinite]">
                    <ZapIcon />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em]">
                    Demo results will appear here
                  </p>
                </div>
              </Reveal>
            </>
          )}
        </div>
      </section>

      <section className="py-28">
        <div className="page-shell">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6C5CE7]/20 bg-[#6C5CE7]/10 px-4 py-1 text-sm font-bold text-[#6C5CE7]">
              The Output
            </div>
            <h2 className="headline theme-text text-4xl font-black tracking-tight sm:text-6xl">
              Everything you need to
              <br />
              <span className="gradient-text">launch and scale</span>
            </h2>
          </div>

          <div className="grid gap-12 lg:grid-cols-3">
            {outputs.map((item, index) => (
              <Reveal
                key={item.title}
                className="group text-center"
                variant="fade-up"
                delayMs={100 + index * 100}
              >
                <div className={`mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[24px] border ${item.accent} transition duration-500 group-hover:scale-110`}>
                  {item.icon}
                </div>
                <h3 className="headline theme-text text-2xl font-black tracking-tight">{item.title}</h3>
                <p className="theme-text-muted mx-auto mt-4 max-w-sm text-lg leading-relaxed">
                  {item.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="page-shell">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6C5CE7]/20 bg-[#6C5CE7]/10 px-4 py-1 text-sm font-bold text-[#6C5CE7]">
              Why Choose Sellworks
            </div>
            <h2 className="headline theme-text text-4xl font-black tracking-tight sm:text-6xl">
              Built for sellers
              <br />
              <span className="gradient-text">who want results</span>
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {reasons.map((item, index) => (
              <Reveal
                key={item.title}
                className="panel group flex flex-col gap-6 rounded-[2rem] p-10 transition hover:bg-[color:var(--menu-item-bg)] hover:border-[color:var(--border)]"
                variant="pop-in"
                delayMs={100 + index * 90}
              >
                <div className="theme-surface flex h-16 w-16 items-center justify-center rounded-2xl border text-[#6C5CE7] transition group-hover:border-[#6C5CE7]/30 group-hover:bg-[#6C5CE7]/10">
                  {item.icon}
                </div>
                <div>
                  <h3 className="headline theme-text text-2xl font-black tracking-tight">{item.title}</h3>
                  <p className="theme-text-muted mt-3 text-lg leading-relaxed">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="page-shell">
          <div className="mb-20 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6C5CE7]/20 bg-[#6C5CE7]/10 px-4 py-1 text-sm font-bold text-[#6C5CE7]">
              The Competitive Edge
            </div>
            <h2 className="headline theme-text text-4xl font-black tracking-tight sm:text-6xl">
              Why Sellworks beats
              <br />
              <span className="gradient-text-spotlight">traditional AI tools</span>
            </h2>
            <p className="theme-text-muted mx-auto mt-8 max-w-3xl text-center text-2xl italic leading-relaxed">
              "Most tools create content. Sellworks creates conversion systems."
            </p>
          </div>

          <Reveal className="panel overflow-hidden rounded-[2rem] border-[color:var(--border)]" variant="pop-in" delayMs={120}>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="theme-subtle border-b border-[color:var(--border)]">
                    <th className="theme-text-muted px-8 py-6 text-xs font-black uppercase tracking-[0.2em]">Feature</th>
                    <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-[#6C5CE7]">Sellworks</th>
                    <th className="theme-text-muted px-8 py-6 text-xs font-black uppercase tracking-[0.2em]">Others</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--border)]">
                  {comparisonRows.map((row) => (
                    <tr key={row.label} className="group transition-colors hover:bg-[color:var(--menu-item-bg)]">
                      <td className="theme-text px-8 py-6 font-bold tracking-tight">{row.label}</td>
                      <td className="px-8 py-6">
                        {row.sellworks ? (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00D4FF]/10 text-[#00D4FF]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-4 w-4">
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </div>
                        ) : (
                          <span className="text-xl text-white/18">×</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        {row.others ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-5 w-5 text-white/35">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        ) : (
                          <span className="text-xl text-white/18">×</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-space">
        <div className="page-shell">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00D4FF]/20 bg-[#00D4FF]/10 px-4 py-1 text-sm font-bold text-[#00D4FF]">
              The Process
            </div>
            <h2 className="headline theme-text text-4xl font-black tracking-tight sm:text-6xl">
              How <span className="gradient-text-spotlight">Sellworks</span> works
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {processSteps.map((step, index) => (
              <Reveal
                key={step.number}
                className="relative flex flex-col items-center text-center"
                variant="fade-up"
                delayMs={100 + index * 140}
              >
                {index < processSteps.length - 1 ? (
                  <div className="absolute right-0 top-12 hidden h-0.5 w-1/2 bg-gradient-to-r from-[#6C5CE7]/20 via-[#00D4FF]/20 to-transparent lg:block" />
                ) : null}
                <div className="group relative mb-10">
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20" />
                  <div className="theme-surface relative flex h-24 w-24 items-center justify-center rounded-full border text-4xl font-black text-[#6C5CE7] transition-all duration-500 group-hover:scale-110 group-hover:border-[#6C5CE7]/30 group-hover:bg-[#6C5CE7]/10">
                    {step.number}
                  </div>
                </div>
                <h3 className="headline theme-text mb-4 text-2xl font-black tracking-tight">{step.title}</h3>
                <p className="theme-text-muted mx-auto mt-6 max-w-sm text-lg leading-relaxed">
                  {step.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="page-shell">
          <div className="mb-16 flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6C5CE7]/20 bg-[#6C5CE7]/10 px-4 py-1 text-sm font-bold text-[#6C5CE7]">
              Community Gallery
              </div>
              <h2 className="headline theme-text text-4xl font-black tracking-tight sm:text-6xl">Get Inspired</h2>
              <p className="theme-text-muted mt-4 text-lg">See what others are creating with Sellworks.</p>
            </div>
            <Link
              href="/pricing"
              className="marketing-accent-link group mt-8 flex items-center gap-2 text-sm font-black uppercase tracking-widest sm:mt-0"
            >
                <span>View All Examples</span>
                <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  <ArrowUpRightIcon />
                </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {showcase.map((item, index) => (
              <Reveal
                key={item.title}
                className="panel group cursor-pointer overflow-hidden rounded-[2rem] transition-all duration-500 hover:border-[#6C5CE7]/30 hover:shadow-[0_20px_40px_rgba(108,92,231,0.1)]"
                variant="pop-in"
                delayMs={80 + index * 100}
              >
                <div className="aspect-square overflow-hidden bg-white/30">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#6C5CE7]">
                    {item.label}
                  </div>
                  <h3 className="headline theme-text text-xl font-black tracking-tight">{item.title}</h3>
                  <div className="theme-text-muted mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] transition-colors group-hover:text-[color:var(--foreground)]">
                    <span>Simulate demo</span>
                    <span className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                      <ArrowUpRightIcon />
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="page-shell">
          <div className="panel-strong relative overflow-hidden rounded-[2.5rem] p-12 text-center sm:p-20">
            <div className="absolute left-0 top-0 h-full w-full opacity-20">
              <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#6C5CE7]/30 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#00D4FF]/25 blur-3xl" />
            </div>
            <div className="relative z-10 mx-auto max-w-3xl">
              <h2 className="headline theme-text text-4xl font-black tracking-tight sm:text-7xl">
                Ready to scale your ecommerce content?
              </h2>
              <p className="theme-text mt-8 text-xl font-medium sm:text-2xl">
                Join 2,000+ brands using Sellworks to launch products 10x faster.
              </p>
              <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
                <button
                  type="button"
                  onClick={openAuth}
                  className="w-full rounded-2xl bg-white px-10 py-5 text-center text-lg font-black uppercase tracking-[0.18em] text-[#6C5CE7] sm:w-auto"
                  style={{ color: "#6C5CE7" }}
                >
                  Start Free Trial
                </button>
                <Link href="/pricing" className="theme-text w-full rounded-2xl border-2 border-[color:var(--border)] px-10 py-5 text-center text-lg font-black uppercase tracking-[0.18em] backdrop-blur-sm sm:w-auto">
                  Book a Demo
                </Link>
              </div>
              <p className="theme-text-muted mt-8 text-sm font-bold uppercase tracking-[0.18em]">
                No credit card required | 7-day free trial
              </p>
            </div>
          </div>
        </div>
      </section>

      <MarketingLoadingOverlay
        isVisible={demoState === "loading"}
        onComplete={handleDemoComplete}
      />
    </div>
  );
}
