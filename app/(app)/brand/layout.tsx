import type { ReactNode } from 'react'
import BrandSettingsSidebar from './_components/BrandSettingsSidebar'

export default function BrandLayout({ children }: { children: ReactNode }) {
  return (
    <main className="app-theme-bg min-h-full">
      <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[260px_minmax(0,1fr)]">
        <BrandSettingsSidebar />
        <div className="min-w-0 px-5 py-5 md:px-7 md:py-6 lg:px-8">{children}</div>
      </div>
    </main>
  )
}
