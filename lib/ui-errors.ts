export function formatLoadError(error: unknown, fallbackMessage: string) {
  const message =
    error instanceof Error ? error.message : typeof error === 'string' ? error : fallbackMessage

  const normalized = message.toLowerCase()

  if (
    normalized.includes('enotfound') ||
    normalized.includes('fetch failed') ||
    normalized.includes('supabase.co') ||
    normalized.includes('getaddrinfo')
  ) {
    return 'Temporary connection issue to Supabase. Please retry in a moment.'
  }

  return message || fallbackMessage
}
