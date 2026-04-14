'use client'

import { useEffect } from 'react'
import { resolveThemePreference, THEME_STORAGE_KEY, type ThemePreference } from '@/lib/theme'

export default function MarketingThemeLock() {
  useEffect(() => {
    const previousTheme = document.documentElement.dataset.theme
    const previousColorScheme = document.documentElement.style.colorScheme

    document.documentElement.dataset.theme = 'light'
    document.documentElement.style.colorScheme = 'light'

    return () => {
      const storedPreference =
        (localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null) || 'system'
      const resolvedTheme = resolveThemePreference(storedPreference)

      document.documentElement.dataset.theme = previousTheme || resolvedTheme
      document.documentElement.style.colorScheme = previousColorScheme || resolvedTheme
    }
  }, [])

  return null
}
