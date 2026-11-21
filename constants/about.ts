import { SITE_CONFIG, CREATOR_SOCIALS } from "@/constants/site"

export const HOME_ABOUT = {
  title: `What is ${SITE_CONFIG.name}?`,
  paragraphs: [
    `${SITE_CONFIG.name} is a weekly launch platform for software products and the developer tools they are built with. Every week a new batch of products and dev tools launches, and the community upvotes what it finds useful.`,
    `Unlike a plain product directory, ${SITE_CONFIG.name} connects each product to its tech stack. Products list the tools they are built with, and every tool page shows the real products using it, so makers get discovered through the stack they chose and tool vendors get a live showcase of who builds with them.`,
    `Every listing is also built to get found by AI. It ships with structured data, a Markdown version and a place in our llms.txt feeds, so ChatGPT, Claude, Perplexity and other AI assistants can read it and recommend it.`,
  ],
  linkLabel: `More about ${SITE_CONFIG.name}`,
} as const

export const ABOUT_PAGE = {
  title: `About ${SITE_CONFIG.name}`,
  heading: `About ${SITE_CONFIG.name}`,
  description: `${SITE_CONFIG.name} is a weekly launch platform that connects software products to the developer tools they are built with. Learn who runs it, how listings work, and how launches are ranked.`,
  sections: [
    {
      title: "What we do",
      body: `${SITE_CONFIG.name} helps makers launch software products and developer tools to an audience of builders, search engines and AI assistants. Each listing gets a permanent page with structured data, a Markdown twin for AI crawlers, and inclusion in our llms.txt feeds.`,
    },
    {
      title: "Products and the tools behind them",
      body: `Our "Built With" graph links every product to the tools in its stack. A product page shows what it runs on; a tool page shows the products built with it. That makes ${SITE_CONFIG.name} useful both for discovering new products and for researching which tools real teams actually ship with.`,
    },
    {
      title: "How launches and rankings work",
      body: `Launches are grouped into ISO weeks. Free launches have a limited number of slots per week; Premium and Premium+ listings skip the cap. Within a week, listings are ranked by community upvotes, and every listing is reviewed by a human before it goes live.`,
    },
    {
      title: "How links work",
      body: `Links on free listings are nofollow until the maker displays the ${SITE_CONFIG.name} badge on their site. Premium and Premium+ listings carry a permanent dofollow link on their listing page. We do not sell links anywhere else on the site.`,
    },
  ],
  founder: {
    name: CREATOR_SOCIALS.name,
    role: `Founder of ${SITE_CONFIG.name}`,
    bio: `${CREATOR_SOCIALS.name} is an independent developer who builds and runs ${SITE_CONFIG.name}, from the launch platform and the Built With graph to editorial review of every listing.`,
    sameAs: [CREATOR_SOCIALS.x, CREATOR_SOCIALS.linkedin],
  },
  contactLabel: "Contact",
} as const
