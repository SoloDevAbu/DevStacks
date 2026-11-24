import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import type { GlossaryTerm } from "@/types/glossary"

export const LAUNCH_TERMS: readonly GlossaryTerm[] = [
  {
    slug: "product-launch",
    term: "Product Launch",
    article: "a",
    aliases: ["launch", "software launch"],
    category: "launch",
    shortDefinition:
      "A product launch is the planned moment a product is introduced to its market, usually across several channels at once to get early users, feedback and links.",
    definition: [
      "A product launch is the coordinated release of a new product, or a major new version, to the people it is built for. For software it usually means opening sign-ups, publishing a landing page and announcing the release on channels where the target users already gather.",
      "Most software teams now launch more than once: a quiet beta, a public launch, then repeat launches for big releases. Each launch is a chance to reach a new audience and to collect the feedback, reviews and backlinks that keep working after launch day.",
    ],
    whyItMatters: [
      "A launch concentrates attention, so early users, press and search engines all notice the product in the same short window.",
      "Listings and posts created during a launch become long-lived backlinks and referral sources.",
      "Launch feedback is often the fastest signal of whether positioning and pricing are right.",
    ],
    onLaunchNests: `${SITE_CONFIG.name} gives every launch a permanent, indexed listing page instead of a 24-hour slot, and each launch also enters that week's community ranking.`,
    relatedTerms: ["launch-directory", "soft-launch", "show-hn", "waitlist"],
    relatedLinks: [
      { label: "Launch your product", href: ROUTES.SUBMIT },
      {
        label: "Where to launch developer tools",
        href: ROUTES.GUIDE_LAUNCH_DEVTOOLS,
      },
    ],
    faqs: [
      {
        question: "How long should you prepare for a product launch?",
        answer:
          "For a small software product, two to four weeks is common: enough time to collect a waitlist, prepare screenshots and copy, and line up the directories and communities you will post to.",
      },
      {
        question: "Can you launch the same product more than once?",
        answer:
          "Yes. Many teams launch a beta, a public version and later major releases separately. Most launch platforms allow a relaunch when there is a meaningful new version.",
      },
    ],
  },
  {
    slug: "launch-directory",
    term: "Launch Directory",
    article: "a",
    aliases: ["launch platform", "startup directory", "SaaS directory"],
    category: "launch",
    shortDefinition:
      "A launch directory is a website where makers list new products so early adopters can discover, vote on and review them.",
    definition: [
      "A launch directory is a curated or community-driven site that lists newly launched products. Visitors browse by category or by launch date, and many directories rank launches by votes for a day or a week.",
      "Directories differ in audience, review time, price and the kind of link they give a listing. Some give a followed (dofollow) link, some mark it nofollow, and some only give a followed link on paid plans.",
    ],
    whyItMatters: [
      "A directory listing puts a new product in front of people who actively look for new tools.",
      "The listing page can send referral traffic and, if the link is followed, pass link equity.",
      "Being listed in several relevant directories helps search engines and AI assistants find and describe the product.",
    ],
    onLaunchNests: `${SITE_CONFIG.name} is a launch directory for developer tools and the products built with them. Its directory database also tracks other launch directories and checks each week whether a real listing's link is dofollow or nofollow.`,
    relatedTerms: [
      "product-launch",
      "dofollow-link",
      "backlink",
      "domain-rating",
    ],
    relatedLinks: [
      { label: "Launch directory database", href: ROUTES.DIRECTORIES },
      {
        label: "Directory link check report",
        href: ROUTES.DIRECTORIES_LINK_CHECK_REPORT,
      },
      {
        label: "Free SaaS directories for backlinks",
        href: ROUTES.GUIDE_SAAS_DIRECTORIES,
      },
    ],
    faqs: [
      {
        question: "Are launch directories still worth it?",
        answer:
          "Relevant ones are. A listing on a directory your users actually browse brings visitors, and a followed link from a trusted directory helps a new domain. Mass submissions to unrelated directories rarely help.",
      },
      {
        question: "How do I know if a directory gives a dofollow link?",
        answer:
          "Open a live listing, inspect the outbound link and check its rel attribute. If it contains nofollow, ugc or sponsored, the link is not followed.",
      },
    ],
  },
  {
    slug: "soft-launch",
    term: "Soft Launch",
    article: "a",
    aliases: ["beta launch", "private beta"],
    category: "launch",
    shortDefinition:
      "A soft launch is a quiet, limited release of a product to a small audience before the public launch, used to find problems while stakes are low.",
    definition: [
      "In a soft launch the product is live but not promoted widely. Access may be limited to a waitlist, an invite list or a single community, and the team watches usage closely.",
      "The goal is to fix onboarding, pricing and reliability problems before a larger audience arrives on a public launch day.",
    ],
    whyItMatters: [
      "Bugs found by fifty users are cheaper than bugs found by five thousand.",
      "Early users can supply testimonials and screenshots for the public launch.",
      "It gives search engines time to crawl and index the site before the launch spike.",
    ],
    onLaunchNests: `A tool or product can be listed on ${SITE_CONFIG.name} during a soft launch and still take part in a later launch week once it opens publicly.`,
    relatedTerms: ["product-launch", "waitlist", "mvp"],
    relatedLinks: [{ label: "Submit a launch", href: ROUTES.SUBMIT }],
    faqs: [
      {
        question: "What is the difference between a soft launch and a beta?",
        answer:
          "They overlap. A beta describes the product's maturity; a soft launch describes how quietly it is released. Many soft launches are public betas with little promotion.",
      },
      {
        question: "How long should a soft launch last?",
        answer:
          "Usually until the main onboarding and reliability issues stop appearing, often a few weeks. It ends with the public launch.",
      },
    ],
  },
  {
    slug: "show-hn",
    term: "Show HN",
    aliases: ["Show Hacker News"],
    category: "launch",
    shortDefinition:
      "Show HN is a post type on Hacker News where people share something they have made that others can try, such as a tool, library or app.",
    definition: [
      'Hacker News, run by Y Combinator, has a dedicated Show HN section. A post starts with "Show HN:" and should link to something readers can use or try, not a landing page or a sign-up wall.',
      "Show HN posts are discussed by a technical audience, so honest feedback, questions about the stack and comparisons with existing tools are common.",
    ],
    whyItMatters: [
      "It reaches developers and technical founders directly, which suits developer tools.",
      "A post that reaches the front page can bring a large, short burst of traffic.",
      "The discussion often surfaces the objections and comparisons a landing page should answer.",
    ],
    onLaunchNests: `Developer tools that launch on Show HN can also be listed on ${SITE_CONFIG.name}, where the listing stays indexed after the Hacker News post scrolls away.`,
    relatedTerms: ["product-launch", "launch-directory", "build-in-public"],
    relatedLinks: [
      {
        label: "Where to launch developer tools",
        href: ROUTES.GUIDE_LAUNCH_DEVTOOLS,
      },
    ],
    faqs: [
      {
        question: "What can be posted as Show HN?",
        answer:
          "Something you made that people can try: software, hardware, a library or a project. Blog posts, sign-up pages and fundraisers are not Show HN material under the site's guidelines.",
      },
      {
        question: "Do Show HN links pass SEO value?",
        answer:
          "Do not count on it. Hacker News adds nofollow to many submission links, so the main value is traffic, feedback and the people who later write about the product.",
      },
    ],
  },
  {
    slug: "waitlist",
    term: "Waitlist",
    article: "a",
    aliases: ["early access list", "pre-launch list"],
    category: "launch",
    shortDefinition:
      "A waitlist is a list of people who sign up to be told when a product opens, collected before or during a limited launch.",
    definition: [
      "A waitlist page collects email addresses from people interested in a product that is not open yet. Teams use it to measure demand, invite users in batches and announce the public launch.",
      "Some waitlists add referral mechanics, letting people move up the list by inviting others.",
    ],
    whyItMatters: [
      "It gives the launch a ready audience on day one.",
      "Sign-up rate is an early signal of demand for the positioning.",
      "Batch invites keep load and support manageable during a soft launch.",
    ],
    onLaunchNests: `Makers can link a waitlist page from a ${SITE_CONFIG.name} listing while the product is still in early access.`,
    relatedTerms: ["soft-launch", "product-launch", "mvp"],
    relatedLinks: [
      { label: "Launch your product", href: ROUTES.SUBMIT_PRODUCT },
    ],
    faqs: [
      {
        question: "How big should a waitlist be before launch?",
        answer:
          "There is no fixed number. What matters more is how many people on it are the intended users and how many respond when invited.",
      },
      {
        question: "Should a waitlist page be indexed by search engines?",
        answer:
          "Usually yes. It lets the brand name start ranking before launch, as long as the page clearly explains what the product does.",
      },
    ],
  },
  {
    slug: "indie-hacker",
    term: "Indie Hacker",
    article: "an",
    aliases: ["indie maker", "solo founder", "bootstrapper"],
    category: "launch",
    shortDefinition:
      "An indie hacker is an independent maker who builds and runs a profitable software product alone or with a very small team, usually without venture funding.",
    definition: [
      "Indie hackers build products, often software, that they own and fund themselves. The aim is typically a sustainable business rather than rapid, funded growth.",
      "Because time and money are limited, indie hackers lean on low-cost channels such as launch directories, communities, content and search.",
    ],
    whyItMatters: [
      "Most products on launch directories are built by indie hackers and small teams.",
      "Their constraints make low-cost, durable channels like SEO and directory listings especially valuable.",
      "Many share revenue and lessons publicly, which shapes how others launch.",
    ],
    onLaunchNests: `Maker profiles on ${SITE_CONFIG.name} show each indie hacker's launched tools and products in one place.`,
    relatedTerms: ["build-in-public", "mvp", "product-launch"],
    relatedLinks: [
      { label: "Browse makers", href: ROUTES.MAKERS },
      { label: "Launch stories", href: ROUTES.BLOG },
    ],
    faqs: [
      {
        question: "Is an indie hacker the same as a startup founder?",
        answer:
          "Not quite. Both start companies, but indie hackers usually stay small and self-funded, while startup founders more often raise money to grow fast.",
      },
      {
        question: "What tech stack do indie hackers use?",
        answer:
          "Usually tools with generous free tiers and little operations work, such as managed databases, serverless hosting and hosted auth and payments.",
      },
    ],
  },
  {
    slug: "build-in-public",
    term: "Build in Public",
    aliases: ["building in public"],
    category: "launch",
    shortDefinition:
      "Building in public means sharing a product's progress, numbers and decisions openly while it is being built.",
    definition: [
      "Makers who build in public post regular updates about features, revenue, mistakes and lessons, usually on social networks, newsletters or a public changelog.",
      "The practice builds an audience before launch, so the launch reaches people who have followed the product's story.",
    ],
    whyItMatters: [
      "An audience built over months turns into early users on launch day.",
      "Public updates create a stream of mentions and links around the product.",
      "Feedback arrives while changes are still cheap.",
    ],
    onLaunchNests: `${SITE_CONFIG.name} publishes maker launch stories, and every listing can be shared as a public progress milestone.`,
    relatedTerms: ["indie-hacker", "product-launch", "show-hn"],
    relatedLinks: [{ label: "Launch stories", href: ROUTES.BLOG }],
    faqs: [
      {
        question: "Does building in public let competitors copy you?",
        answer:
          "It can reveal ideas, but execution, distribution and the audience you build are harder to copy than features.",
      },
      {
        question: "What should you share when building in public?",
        answer:
          "Progress, decisions and their reasons, numbers you are comfortable with, and lessons from mistakes. Avoid sharing customer data or anything under agreement.",
      },
    ],
  },
  {
    slug: "mvp",
    term: "Minimum Viable Product (MVP)",
    article: "a",
    aliases: ["MVP", "minimum viable product"],
    category: "launch",
    shortDefinition:
      "A minimum viable product is the smallest version of a product that lets a team test its main assumption with real users.",
    definition: [
      "An MVP includes only what is needed to learn whether people want the product and will use it. Everything else is postponed until that question is answered.",
      "For software, an MVP is often a single core workflow, built on managed services so the team spends its time on the product rather than infrastructure.",
    ],
    whyItMatters: [
      "It shortens the time between an idea and real feedback.",
      "It limits how much work is wasted if the idea does not hold.",
      "A focused MVP is easier to explain on a launch page.",
    ],
    onLaunchNests: `Many ${SITE_CONFIG.name} launches are MVPs, and the Built With data shows which tools makers pick to ship them quickly.`,
    relatedTerms: ["product-market-fit", "soft-launch", "backend-as-a-service"],
    relatedLinks: [
      {
        label: "Popular building blocks",
        href: ROUTES.DISCOVER_POPULAR_BUILDING_BLOCKS,
      },
    ],
    faqs: [
      {
        question: "How minimal should an MVP be?",
        answer:
          "Minimal enough to ship quickly, but complete enough that a user can get the core value from it. A broken experience tests nothing.",
      },
      {
        question: "Should you launch an MVP publicly?",
        answer:
          "Often yes, as a beta or soft launch, so you learn from real users rather than guesses.",
      },
    ],
  },
  {
    slug: "product-market-fit",
    term: "Product-Market Fit",
    aliases: ["PMF"],
    category: "launch",
    shortDefinition:
      "Product-market fit is the point where a product clearly satisfies a real demand, so users keep using it and growth comes with less pushing.",
    definition: [
      "A product has product-market fit when a defined group of users needs it, keeps using it and would be disappointed to lose it. Signs include strong retention, organic referrals and customers asking for more.",
      "Before fit, a launch mostly teaches the team what to change. After fit, launches and marketing amplify demand that already exists.",
    ],
    whyItMatters: [
      "It tells a team whether to keep iterating on the product or start scaling distribution.",
      "Retention after launch is a more reliable fit signal than launch-day votes.",
      "Positioning that matches fit makes every channel, including search, convert better.",
    ],
    onLaunchNests: `Launch rankings on ${SITE_CONFIG.name} show early interest, but long-term views and votes on a listing say more about fit than a single launch week.`,
    relatedTerms: ["mvp", "product-launch", "click-through-rate"],
    relatedLinks: [{ label: "Trending launches", href: ROUTES.TRENDING }],
    faqs: [
      {
        question: "How do you measure product-market fit?",
        answer:
          "Common measures are retention curves that flatten instead of dropping to zero, the share of users who would be very disappointed without the product, and growth from referrals.",
      },
      {
        question: "Can a product lose product-market fit?",
        answer:
          "Yes. Markets change, competitors arrive and needs shift, so fit has to be kept, not just found once.",
      },
    ],
  },
  {
    slug: "launch-badge",
    term: "Launch Badge",
    article: "a",
    aliases: ["featured badge", "embed badge"],
    category: "launch",
    shortDefinition:
      "A launch badge is a small image a maker places on their site to show the product was featured on a launch platform, linking back to the listing.",
    definition: [
      'Launch platforms offer badges such as "Featured on" or "Launched on" that makers embed on their homepage or footer. The badge links to the product\'s listing.',
      "Some platforms use the badge as a trust exchange: the listing's outbound link becomes followed only while the badge stays on the maker's site.",
    ],
    whyItMatters: [
      "It adds social proof for visitors who have not heard of the product.",
      "It sends visitors from the maker's site to the listing, where they can vote or comment.",
      "On some platforms it changes the listing's link from nofollow to dofollow.",
    ],
    onLaunchNests: `On ${SITE_CONFIG.name}, a free listing's link is nofollow until the maker shows the badge on their site. A weekly check confirms the badge is still there; Premium and Premium+ listings carry a permanent dofollow link.`,
    relatedTerms: ["dofollow-link", "nofollow-link", "backlink"],
    relatedLinks: [
      { label: "Pricing and listing plans", href: ROUTES.PRICING },
      { label: `About ${SITE_CONFIG.name}`, href: ROUTES.ABOUT },
    ],
    faqs: [
      {
        question: "Does a badge in a GitHub README count?",
        answer:
          "GitHub marks README links nofollow, so a README badge adds visibility but not a followed link. A badge on your own website is the one that counts for link checks.",
      },
      {
        question: "Where should a launch badge go on a site?",
        answer:
          'The footer or a "featured on" strip on the homepage are common. It must be crawlable, so it should not be hidden or blocked by robots rules.',
      },
    ],
  },
]
