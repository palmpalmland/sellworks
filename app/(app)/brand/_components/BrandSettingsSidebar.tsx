'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  {
    group: 'Workspace',
    items: [
      { href: '/brand/general', label: 'General' },
      { href: '/brand/platforms', label: 'Platforms' },
      { href: '/brand/members', label: 'Members' },
    ],
  },
]

export default function BrandSettingsSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <aside className="theme-sidebar border-r px-4 py-4">
      <div className="flex items-center gap-3 px-3">
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="theme-subtle theme-subtle-hover flex h-10 w-10 items-center justify-center rounded-[0.9rem] text-xl theme-text transition"
          aria-label="Back to workspace"
          title="Back to workspace"
        >
          ←
        </button>
        <div className="text-2xl font-bold theme-text">Settings</div>
      </div>

      <div className="mt-8 space-y-5">
        {navItems.map((section) => (
          <div key={section.group}>
            <div className="theme-text-muted px-3 text-xs font-bold uppercase tracking-[0.18em]">
              {section.group}
            </div>
            <div className="mt-2 space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      isActive
                        ? 'theme-subtle block rounded-[1rem] px-3 py-2.5 text-sm font-semibold theme-text'
                        : 'theme-text-muted block rounded-[1rem] px-3 py-2.5 text-sm font-medium transition hover:bg-white/[0.04] hover:text-white'
                    }
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
