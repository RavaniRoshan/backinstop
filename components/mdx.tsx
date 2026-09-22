import defaultMdxComponents from 'fumadocs-ui/mdx';
import { ExternalLink } from 'lucide-react';
import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ExternalLinkIcon: () => <ExternalLink size={14} />,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;
