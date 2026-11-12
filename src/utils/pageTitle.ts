const SITE = 'Tara'

// The browser tab title for a URL path.
export function getPageTitle(pathname: string): string {
  // Ignore a trailing slash ("/trips/" is the same page as "/trips").
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname

  if (path === '/') return 'Tara — plan trips with your barkada'
  if (path === '/dashboard') return `Dashboard · ${SITE}`
  if (path === '/trips') return `My Trips · ${SITE}`
  if (path === '/trips/new') return `New trip · ${SITE}`
  if (path === '/polls') return `Polls · ${SITE}`

  if (/^\/trips\/[^/]+$/.test(path)) return `Trip details · ${SITE}`
  if (/^\/trips\/[^/]+\/edit$/.test(path)) return `Edit trip · ${SITE}`
  if (/^\/trips\/[^/]+\/activities\/new$/.test(path)) {
    return `Add activity · ${SITE}`
  }
  if (/^\/trips\/[^/]+\/activities\/[^/]+\/edit$/.test(path)) {
    return `Edit activity · ${SITE}`
  }

  return `Page not found · ${SITE}`
}