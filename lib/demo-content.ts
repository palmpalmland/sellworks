export const marketingDemo = {
  exampleUrl: "https://www.amazon.com/example-portable-blender",
  inputPlaceholder: "Paste Amazon, Shopify, or TikTok Shop product link",
  resultLabel: "Generation Complete",
  resultTitle: "Your Content Kit is Ready",
  resultSubtitle: "We've generated a full suite of high-converting assets for your product.",
  copy: {
    title: "Portable Blender Bottle for Smoothies On the Go",
    bullets: [
      "USB rechargeable and portable",
      "Powerful blending performance",
      "Perfect for travel, gym, and work",
    ],
    description:
      "Blend smoothies, protein shakes, and iced coffee anywhere with a compact portable blender designed for busy routines.",
  },
  video: {
    badge: "Viral Hook",
    format: "UGC",
    headline: "This portable blender is a game changer for my morning routine.",
    note: "9:16 Vertical | Demo Preview",
    poster: "/demo/images/video-poster.svg",
  },
  generatedAssets: [
    { label: "Amazon Listing", title: "Smart Watch" },
    { label: "UGC Video", title: "Coffee Maker" },
    { label: "TikTok Ad", title: "Ergonomic Chair" },
  ],
  images: [
    {
      label: "Hero Image",
      title: "Portable Blender Front View",
      src: "/demo/images/blender-hero.svg",
    },
    {
      label: "Lifestyle Image",
      title: "Portable Blender In Use",
      src: "/demo/images/blender-lifestyle.svg",
    },
    {
      label: "Ad Creative",
      title: "Portable Blender Promo Card",
      src: "/demo/images/blender-ad.svg",
    },
  ],
} as const

export type MarketingDemo = typeof marketingDemo
