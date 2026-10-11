export interface FeaturedBadge {
  id: string
  href: string
  target: string
  rel?: string
  title?: string
  src: string
  alt: string
  width: number
  height?: number
}

export const FEATURED_BADGES: readonly FeaturedBadge[] = [
  {
    id: "product-hunt",
    href: "https://www.producthunt.com/products/launchnests?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-launchnests",
    target: "_blank",
    rel: "noopener noreferrer",
    src: "https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1263668&theme=light&t=1790961643259",
    alt: "LaunchNests - Discover products, tools & the tech behind them | Product Hunt",
    width: 250,
    height: 54,
  },
  {
    id: "scroll-launch",
    href: "https://www.scrolllaunch.com/products/launchnests?ref=badge",
    target: "_blank",
    rel: "noopener",
    src: "https://www.scrolllaunch.com/api/badge/launchnests?variant=launched&theme=light",
    alt: "LaunchNests - Featured on ScrollLaunch",
    width: 220,
    height: 48,
  },
  {
    id: "startup-fast",
    href: "https://startupfa.st",
    target: "_blank",
    title: "Powered by Startup Fast",
    src: "https://startupfa.st/images/badges/powered-by-light.svg",
    alt: "Powered by Startup Fast",
    width: 150,
    height: 44,
  },
  {
    id: "startup-fame",
    href: "https://startupfa.me/s/launchnests?utm_source=www.launchnests.com",
    target: "_blank",
    src: "https://startupfa.me/badges/featured-badge.webp",
    alt: "LaunchNests - Featured on Startup Fame",
    width: 171,
    height: 54,
  },
  {
    id: "ufind-best",
    href: "https://ufind.best/products/launchnests",
    target: "_blank",
    rel: "noopener",
    src: "https://ufind.best/badges/ufind-best-badge-light.svg",
    alt: "Featured on ufind.best",
    width: 150,
  },
  {
    id: "wired-business",
    href: "https://wired.business",
    target: "_blank",
    rel: "noopener",
    src: "https://wired.business/badge0-light.svg",
    alt: "Featured on Wired Business",
    width: 200,
    height: 54,
  },
  {
    id: "twelve-tools",
    href: "https://twelve.tools",
    target: "_blank",
    rel: "noopener",
    src: "https://twelve.tools/badge3-white.svg",
    alt: "Featured on Twelve Tools",
    width: 148,
    height: 40,
  },
  {
    id: "submit-ai-tools",
    href: "https://submitaitools.org",
    target: "_blank",
    src: "https://submitaitools.org/static_submitaitools/images/submitaitools.png",
    alt: "Submit AI Tools",
    width: 200,
    height: 60,
  },
  {
    id: "serp-best",
    href: "https://best.serp.co/products/launchnests.com/",
    target: "_blank",
    rel: "noopener noreferrer",
    title: "Featured on SERP Best",
    src: "https://best.serp.co/badge/featured-on-serp.co-light.svg",
    alt: "Featured on SERP Best",
    width: 200,
    height: 50,
  },
  {
    id: "dofollow-tools",
    href: "https://dofollow.tools",
    target: "_blank",
    src: "https://dofollow.tools/badge/badge_light.svg",
    alt: "Featured on Dofollow.Tools",
    width: 200,
    height: 54,
  },
  {
    id: "findly-tools",
    href: "https://findly.tools/launchnests?utm_source=launchnests",
    target: "_blank",
    rel: "noopener noreferrer",
    src: "https://findly.tools/badges/findly-tools-badge-light.svg",
    alt: "Featured on Findly.tools",
    width: 175,
    height: 55,
  },
  {
    id: "codehype",
    href: "https://www.codehype.ai/product/launchnests?utm_source=codehype_badge",
    target: "_blank",
    rel: "noopener noreferrer",
    src: "https://www.codehype.ai/badges/launchnests.svg?variant=find-us&v=20",
    alt: "Featured on CodeHype",
    width: 180,
    height: 65,
  },
] as const
