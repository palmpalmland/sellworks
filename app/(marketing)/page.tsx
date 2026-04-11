import Link from "next/link";

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

const showcase = [
  { label: "Content Kit", title: "Portable Blender" },
  { label: "TikTok Ad", title: "Ergonomic Chair" },
  { label: "Amazon Listing", title: "Smart Watch" },
  { label: "UGC Video", title: "Coffee Maker" },
];

const comparisonRows = [
  {
    label: "One product link to a full content kit",
    sellworks: true,
    tools: false,
    agencies: false,
  },
  {
    label: "Amazon-ready images and PDP copy together",
    sellworks: true,
    tools: false,
    agencies: true,
  },
  {
    label: "TikTok hooks and ad creative generation",
    sellworks: true,
    tools: true,
    agencies: true,
  },
  {
    label: "Fast enough for daily product testing",
    sellworks: true,
    tools: false,
    agencies: false,
  },
];

export default function HomePage() {
  return (
    <div className="bg-background selection:bg-[#6C5CE7]/30">
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 py-28 md:py-32">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-[#6C5CE7]/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-[#00D4FF]/10 blur-[120px]" />
          <div className="absolute left-1/2 top-[20%] h-[800px] w-full -translate-x-1/2 bg-[radial-gradient(circle_at_50%_0%,rgba(108,92,231,0.08)_0%,transparent_70%)]" />
        </div>

        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-[#6C5CE7]" />
            <span className="text-white/80">New: TikTok Shop Integration Live</span>
          </div>

          <h1 className="headline text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-7xl lg:text-8xl">
            Turn any product into
            <br />
            <span className="gradient-text">high-converting ads</span>
            <br />
            in 60 seconds
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
            Sellworks analyzes your product and generates everything you need to sell:
            Amazon-ready images, TikTok ads, and conversion-optimized copy.
          </p>

          <div className="mx-auto mt-16 w-full max-w-3xl">
            <div className="panel-strong group relative flex flex-col gap-4 rounded-[2rem] p-5 transition-all duration-500 hover:border-white/10 hover:shadow-[0_0_50px_rgba(108,92,231,0.15)] sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/34">
                  <LinkIcon />
                </div>
                <input
                  placeholder="Paste Amazon, Shopify, or TikTok Shop product link"
                  className="h-16 w-full rounded-2xl bg-background/40 pl-14 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30"
                  type="text"
                  readOnly
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-16 items-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-6 font-semibold text-white">
                  <ImageIcon />
                  <span className="hidden sm:inline">Upload</span>
                </div>
                <Link href="/login" className="flex h-16 items-center gap-3 rounded-2xl bg-[linear-gradient(135deg,#6C5CE7_0%,#00D4FF_100%)] px-10 font-bold text-white">
                  <span>Generate</span>
                </Link>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="text-sm text-white/42">No link?</span>
              <span className="text-sm font-bold text-[#6C5CE7] underline underline-offset-4">
                Try an example product
              </span>
            </div>

            <div className="mt-10 flex items-center justify-center gap-8 text-sm font-bold uppercase tracking-[0.2em] text-white/28">
              <span>Amazon</span>
              <span>Shopify</span>
              <span>TikTok Shop</span>
              <span>Meta</span>
            </div>
          </div>
        </div>
      </section>

      <section id="product" className="section-space scroll-mt-28">
        <div className="page-shell">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6C5CE7]/20 bg-[#6C5CE7]/10 px-4 py-1 text-sm font-bold text-[#6C5CE7]">
              The Sellworks Advantage
            </div>
            <h2 className="headline text-4xl font-black tracking-tight text-white sm:text-6xl">
              From one product link to a
              <br />
              <span className="gradient-text">full content kit</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/58">
              Most tools generate one asset at a time. Sellworks analyzes your product and
              generates your entire marketing system in seconds.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((item) => (
              <div key={item.title} className="panel group rounded-[2rem] p-8 transition-all duration-500 hover:bg-white/[0.03] hover:border-white/10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/5 bg-white/5 transition-all duration-500 group-hover:border-[#6C5CE7]/30 group-hover:bg-[#6C5CE7]/10">
                  <div className={item.accent}>{item.icon}</div>
                </div>
                <h3 className="headline text-xl font-black tracking-tight text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55 transition-colors group-hover:text-white/72">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="section-space scroll-mt-28">
        <div className="page-shell">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1 text-sm font-bold text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              Generation Complete
            </div>
            <h2 className="headline text-4xl font-black tracking-tight text-white sm:text-6xl">
              Your Content Kit is Ready
            </h2>
            <p className="mt-4 text-lg text-white/56">
              We&apos;ve generated a full suite of high-converting assets for your product.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="panel-strong overflow-hidden rounded-[2rem]">
              <div className="mx-auto aspect-[9/16] max-h-[620px] max-w-[340px] rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(108,92,231,0.2),rgba(0,0,0,0.6))] p-6 shadow-2xl">
                <div className="flex h-full flex-col justify-between">
                  <div className="flex gap-2">
                    <span className="rounded-full bg-[#6C5CE7] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">Viral Hook</span>
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">UGC</span>
                  </div>
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
                    <div className="ml-1 h-0 w-0 border-y-[14px] border-l-[22px] border-y-transparent border-l-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold leading-relaxed text-white">
                      This portable blender is a game changer for my morning routine.
                    </h4>
                    <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/74">
                      <ZapIcon />
                      <span>High-Res Export Locked</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 bg-white/[0.02] p-8">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-black">Download</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-white">Remix</div>
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/38">
                  9:16 Vertical | 4K AI Render
                </div>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="panel rounded-[2rem] p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="headline text-xl font-black text-white">Product Copy</h3>
                  <div className="rounded-xl border border-white/8 bg-white/5 px-4 py-2 text-sm font-medium text-white">Copy All</div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-white/36">Product Title</label>
                    <p className="text-lg font-semibold leading-tight text-white">
                      Portable Blender Bottle for Smoothies On the Go
                    </p>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-white/36">Key Features</label>
                    <ul className="space-y-2 text-sm text-white/82">
                      <li>USB rechargeable and portable</li>
                      <li>Powerful blending performance</li>
                      <li>Perfect for travel, gym, and work</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="panel rounded-[2rem] p-8">
                <div className="mb-6 text-xs font-black uppercase tracking-[0.18em] text-white/36">
                  Generated Assets
                </div>
                <div className="space-y-4">
                  <div className="rounded-[1.4rem] border border-white/8 bg-white/5 p-5">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6C5CE7]">Amazon Listing</div>
                    <div className="mt-2 text-lg font-bold text-white">Smart Watch</div>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/8 bg-white/5 p-5">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6C5CE7]">UGC Video</div>
                    <div className="mt-2 text-lg font-bold text-white">Coffee Maker</div>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/8 bg-white/5 p-5">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6C5CE7]">TikTok Ad</div>
                    <div className="mt-2 text-lg font-bold text-white">Ergonomic Chair</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white/[0.01] py-28">
        <div className="page-shell">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6C5CE7]/20 bg-[#6C5CE7]/10 px-4 py-1 text-sm font-bold text-[#6C5CE7]">
              The Output
            </div>
            <h2 className="headline text-4xl font-black tracking-tight text-white sm:text-6xl">
              Everything you need to
              <br />
              <span className="gradient-text">launch and scale</span>
            </h2>
          </div>

          <div className="grid gap-12 lg:grid-cols-3">
            {outputs.map((item) => (
              <div key={item.title} className="group text-center">
                <div className={`mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[24px] border ${item.accent} transition duration-500 group-hover:scale-110`}>
                  {item.icon}
                </div>
                <h3 className="headline text-2xl font-black tracking-tight text-white">{item.title}</h3>
                <p className="mx-auto mt-4 max-w-sm text-lg leading-relaxed text-white/56">
                  {item.description}
                </p>
              </div>
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
            <h2 className="headline text-4xl font-black tracking-tight text-white sm:text-6xl">
              Built for sellers
              <br />
              <span className="gradient-text">who want results</span>
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {reasons.map((item) => (
              <div key={item.title} className="panel group flex flex-col gap-6 rounded-[2rem] p-10 transition hover:bg-white/[0.03] hover:border-white/10">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/5 bg-white/5 text-[#6C5CE7] transition group-hover:border-[#6C5CE7]/30 group-hover:bg-[#6C5CE7]/10">
                  {item.icon}
                </div>
                <div>
                  <h3 className="headline text-2xl font-black tracking-tight text-white">{item.title}</h3>
                  <p className="mt-3 text-lg leading-relaxed text-white/56">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="page-shell">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00D4FF]/20 bg-[#00D4FF]/10 px-4 py-1 text-sm font-bold text-[#00D4FF]">
              Compare
            </div>
            <h2 className="headline text-4xl font-black tracking-tight text-white sm:text-6xl">
              Why teams pick Sellworks
              <br />
              <span className="gradient-text">instead of stitching tools together</span>
            </h2>
          </div>

          <div className="panel overflow-hidden rounded-[2rem]">
            <div className="grid grid-cols-[1.4fr_repeat(3,0.7fr)] border-b border-white/8 bg-white/[0.03] text-sm font-black uppercase tracking-[0.18em] text-white/70">
              <div className="px-6 py-5">Capability</div>
              <div className="px-4 py-5 text-center">Sellworks</div>
              <div className="px-4 py-5 text-center">Generic AI Tools</div>
              <div className="px-4 py-5 text-center">Agency Workflow</div>
            </div>
            {comparisonRows.map((row) => (
              <div key={row.label} className="grid grid-cols-[1.4fr_repeat(3,0.7fr)] border-b border-white/6 last:border-b-0">
                <div className="px-6 py-5 text-sm font-medium text-white/82">{row.label}</div>
                {[row.sellworks, row.tools, row.agencies].map((value, index) => (
                  <div key={`${row.label}-${index}`} className="flex items-center justify-center px-4 py-5">
                    <span
                      className={
                        value
                          ? "flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300"
                          : "flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/26"
                      }
                    >
                      {value ? "✓" : "—"}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="page-shell">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6C5CE7]/20 bg-[#6C5CE7]/10 px-4 py-1 text-sm font-bold text-[#6C5CE7]">
              Example Kits
            </div>
            <h2 className="headline text-4xl font-black tracking-tight text-white sm:text-6xl">
              See the kinds of products
              <br />
              <span className="gradient-text">Sellworks can package</span>
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {showcase.map((item, index) => (
              <div key={item.title} className="panel group overflow-hidden rounded-[2rem] transition hover:border-[#6C5CE7]/30 hover:shadow-[0_20px_40px_rgba(108,92,231,0.1)]">
                <div className="aspect-square bg-[radial-gradient(circle_at_20%_20%,rgba(108,92,231,0.35),transparent_45%),linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]" />
                <div className="p-6">
                  <div className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#6C5CE7]">
                    {item.label}
                  </div>
                  <h3 className="headline text-xl font-black tracking-tight text-white">{item.title}</h3>
                  <div className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-white/42">
                    Simulate demo {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="page-shell">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[linear-gradient(135deg,#6C5CE7_0%,#00D4FF_100%)] p-12 text-center sm:p-20">
            <div className="absolute left-0 top-0 h-full w-full opacity-20">
              <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-white blur-3xl" />
              <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-white blur-3xl" />
            </div>
            <div className="relative z-10 mx-auto max-w-3xl">
              <h2 className="headline text-4xl font-black tracking-tight text-white sm:text-7xl">
                Ready to scale your ecommerce content?
              </h2>
              <p className="mt-8 text-xl font-medium text-white/92 sm:text-2xl">
                Join 2,000+ brands using Sellworks to launch products 10x faster.
              </p>
              <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
                <Link href="/login" className="w-full rounded-2xl bg-white px-10 py-5 text-center text-lg font-black uppercase tracking-[0.18em] text-[#6C5CE7] sm:w-auto">
                  Start Free Trial
                </Link>
                <Link href="/pricing" className="w-full rounded-2xl border-2 border-white/30 px-10 py-5 text-center text-lg font-black uppercase tracking-[0.18em] text-white backdrop-blur-sm sm:w-auto">
                  Book a Demo
                </Link>
              </div>
              <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-white/64">
                No credit card required | 7-day free trial
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
