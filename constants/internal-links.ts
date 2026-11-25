import { SHOW_HN_GUIDE } from "@/constants/guides/show-hn"
import { SUBMIT_STARTUP_GUIDE } from "@/constants/guides/submit-startup"
import { ROUTES } from "@/constants/routes"
import type { Guide } from "@/types/guides"

export interface ResourceLink {
  href: string
  title: string
  description: string
}

export const toGuideLink = ({ slug, title, description }: Guide): ResourceLink => ({
  href: ROUTES.GUIDE(slug),
  title,
  description,
})

// Hand-built guide pages that live at their own routes, listed on the guides hub next to the data-driven ones.
export const STANDALONE_GUIDE_LINKS: readonly ResourceLink[] = [
  {
    href: ROUTES.GUIDE_LAUNCH_DEVTOOLS,
    title: "Where to launch developer tools in 2026",
    description:
      "Launch platforms for dev tools, with what each one is good for.",
  },
  {
    href: ROUTES.GUIDE_SAAS_DIRECTORIES,
    title: "Free SaaS directories for backlinks",
    description:
      "Directories you can submit to for free, and the link each one gives.",
  },
]

// The editorial pages that answer "where should I launch?". Each one links to the others, so a
// visitor or crawler landing on any of them can reach the whole set.
export const LAUNCH_RESOURCE_LINKS: readonly ResourceLink[] = [
  ...STANDALONE_GUIDE_LINKS,
  toGuideLink(SUBMIT_STARTUP_GUIDE),
  toGuideLink(SHOW_HN_GUIDE),
  {
    href: ROUTES.DIRECTORIES,
    title: "Launch directory database",
    description:
      "Prices, review times and a weekly machine check of each directory's link.",
  },
  {
    href: ROUTES.DIRECTORIES_LINK_CHECK_REPORT,
    title: "Directory link check report",
    description:
      "Which launch directories gave a real listing a dofollow link in the latest check.",
  },
  {
    href: ROUTES.PRODUCTHUNT_ALTERNATIVES,
    title: "Product Hunt alternatives",
    description:
      "Other places to launch, compared on audience, cost and links.",
  },
  {
    href: ROUTES.PRODUCT_LAUNCH_PLATFORM,
    title: "Product launch platform",
    description: "How a weekly launch on LaunchNests works, start to finish.",
  },
  {
    href: ROUTES.PRICING,
    title: "LaunchNests pricing",
    description:
      "Free, Premium and Premium+ listings, and what each one includes.",
  },
]
