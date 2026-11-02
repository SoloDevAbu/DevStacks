import { ROUTES } from "@/constants/routes"

export interface MarkdownTwinRoute {
  pattern: RegExp
  // Internal route that renders the markdown representation.
  twin: (match: RegExpMatchArray) => string
  // Public URL advertised in the `Link: rel=alternate` header (defaults to the twin).
  alias?: (match: RegExpMatchArray) => string
}

// Every HTML route with a markdown representation, shared by `Accept: text/markdown` negotiation
// and the `Link` header so the two can never disagree.
export const MARKDOWN_TWIN_ROUTES: readonly MarkdownTwinRoute[] = [
  {
    pattern: /^\/$/,
    twin: () => ROUTES.MARKDOWN_HOME,
    alias: () => ROUTES.HOME_MARKDOWN_ALIAS,
  },
  {
    pattern: /^\/tools\/category\/([^/]+)$/,
    twin: ([, slug]) => `/api/md/tools/category/${slug}`,
  },
  {
    pattern: /^\/(alternatives|built-with)\/([^/]+)$/,
    twin: ([, section, slug]) => `/api/md/${section}/${slug}`,
  },
  {
    pattern: /^\/(tools|products|blog|makers)\/(?!categories$)([^/.]+)$/,
    twin: ([, section, slug]) => `/api/md/${section}/${slug}`,
    alias: ([, section, slug]) => `/${section}/${slug}.md`,
  },
  {
    pattern: /^\/(pricing|faq|terms|privacy|refund)$/,
    twin: ([, page]) => `/${page}.md`,
  },
]

// `.md` aliases that are not real routes: `/tools/<slug>.md` → `/api/md/tools/<slug>`.
export const MARKDOWN_SUFFIX_ROUTES: readonly MarkdownTwinRoute[] = [
  {
    pattern: /^\/index\.md$/,
    twin: () => ROUTES.MARKDOWN_HOME,
  },
  {
    pattern: /^\/(tools|products|blog|makers)\/([^/]+)\.md$/,
    twin: ([, section, slug]) => `/api/md/${section}/${slug}`,
  },
]

export const MARKDOWN_MEDIA_TYPES = ["text/markdown", "text/x-markdown"] as const
