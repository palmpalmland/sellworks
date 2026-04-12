type SellworksLogoProps = {
  className?: string
}

export default function SellworksLogo({ className = "h-10 w-10" }: SellworksLogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sellworksGradient" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6C63FF" />
          <stop offset="1" stopColor="#34D6FF" />
        </linearGradient>
      </defs>

      <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#sellworksGradient)" />
      <path d="M24 20H40V36" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 40L40 24" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
