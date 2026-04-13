'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    group: 'Workspace',
    items: [
      { href: '/brand/general', label: 'General' },
      { href: '/brand/members', label: 'Members' },
    ],
  },
]

export default function BrandSettingsSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <aside className="border-r border-white/8 bg-[#090a0e] px-5 py-6">
      <div className="flex items-center gap-3 px-3">
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="flex h-10 w-10 items-center justify-center rounded-[0.9rem] bg-white/[0.06] text-xl text-white/84 transition hover:bg-white/[0.1] hover:text-white"
          aria-label="Back to workspace"
        >
          ←
        </button>
        <div className="text-2xl font-bold text-white">Settings</div>
      </div>

      <div className="mt-8 space-y-5">
        {navItems.map((section) => (
          <div key={section.group}>
            <div className="px-3 text-xs font-bold uppercase tracking-[0.18em] text-white/30">
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
                        ? 'block rounded-[1rem] bg-white/[0.08] px-3 py-2.5 text-sm font-semibold text-white'
                        : 'block rounded-[1rem] px-3 py-2.5 text-sm font-medium text-white/64 transition hover:bg-white/[0.04] hover:text-white'
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
