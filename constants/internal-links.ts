import { ROUTES } from "@/constants/routes"

export interface ResourceLink {
  href: string
  title: string
  description: string
}

// The editorial pages that answer "where should I launch?". Each one links to the others, so a
// visitor or crawler landing on any of them can reach the whole set.
export const LAUNCH_RESOURCE_LINKS: readonly ResourceLink[] = [
  {
    href: ROUTES.GUIDE_LAUNCH_DEVTOOLS,
    title: "Where to launch developer tools in 2026",
    description: "Launch platforms for dev tools, with what each one is good for.",
  },
  {
    href: ROUTES.GUIDE_SAAS_DIRECTORIES,
    title: "Free SaaS directories for backlinks",
    description: "Directories you can submit to for free, and the link each one gives.",
  },
  {
    href: ROUTES.PRODUCTHUNT_ALTERNATIVES,
    title: "Product Hunt alternatives",
    description: "Other places to launch, compared on audience, cost and links.",
  },
  {
    href: ROUTES.PRODUCT_LAUNCH_PLATFORM,
    title: "Product launch platform",
    description: "How a weekly launch on LaunchNests works, start to finish.",
  },
  {
    href: ROUTES.PRICING,
    title: "LaunchNests pricing",
    description: "Free, Premium and Premium+ listings, and what each one includes.",
  },
]
