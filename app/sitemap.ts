import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const docsRoutes = [
    '/docs',
    '/docs/tutorials/quickstart',
    '/docs/tutorials/runaway-loop-demo',
    '/docs/tutorials/using-budgets',
    '/docs/how-to/install',
    '/docs/how-to/dashboard',
    '/docs/how-to/configure-retries',
    '/docs/how-to/export-a-chargeback',
    '/docs/how-to/isolate-agents',
    '/docs/how-to/per-tenant-budgets-fastapi',
    '/docs/how-to/priority-admission',
    '/docs/how-to/run-in-shadow-mode',
    '/docs/how-to/setup-shared-budget',
    '/docs/reference/cli',
    '/docs/reference/sdk-matrix',
    '/docs/reference/concurrency',
    '/docs/reference/ledger-schema',
    '/docs/reference/benchmark-results-2026-07-20',
    '/docs/reference/compatibility',
    '/docs/reference/exceptions',
    '/docs/reference/configuration',
    '/docs/explanation/architecture',
    '/docs/explanation/benchmarks',
    '/docs/explanation/what-the-ledger-is',
    '/docs/explanation/threat-model',
    '/docs/explanation/budgets',
    '/docs/explanation/circuit-breaker',
    '/docs/explanation/aimd',
    '/docs/explanation/caching',
    '/docs/explanation/why-in-process-vs-proxies',
  ]

  const docs = docsRoutes.map((url) => ({
    url: absoluteUrl(url),
    lastModified: new Date(),
  }))

  return [
    {
      url: absoluteUrl('/'),
      lastModified: new Date(),
    },
    ...docs,
  ]
}
