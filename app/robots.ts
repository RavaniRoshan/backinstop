import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/lib/site'

/**
 * Previously there was no robots.txt at all: the request fell through to the
 * 404 handler, which served a `noindex` HTML page. Declaring the sitemap here
 * is what actually points a crawler at the 30 documented routes.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
