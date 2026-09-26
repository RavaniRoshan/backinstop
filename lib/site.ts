/**
 * Single source of truth for this site's canonical origin.
 *
 * This existed as a hardcoded `https://backstop.ai` string in three places
 * (sitemap, docs canonical, and implicitly the OG tags). That domain does not
 * resolve, so every canonical link and all 30 sitemap URLs pointed at a dead
 * host - which tells a search engine to consolidate the whole site onto a page
 * that cannot be fetched. It is now read from the environment with the real
 * deployed origin as the default.
 *
 * Set `NEXT_PUBLIC_SITE_URL` in Vercel when a real domain is attached; no code
 * change is needed then.
 */
const DEFAULT_SITE_URL = 'https://backinstop.vercel.app';

function normalise(value: string | undefined): string {
  const raw = (value ?? '').trim() || DEFAULT_SITE_URL;
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  // strip any trailing slash so `${SITE_URL}${path}` never doubles up
  return withScheme.replace(/\/+$/, '');
}

export const SITE_URL = normalise(process.env.NEXT_PUBLIC_SITE_URL);

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
