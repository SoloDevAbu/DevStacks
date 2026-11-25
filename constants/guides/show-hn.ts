import { GUIDE_SLUGS } from "@/constants/guides/slugs"
import { ROUTES } from "@/constants/routes"
import type { Guide } from "@/types/guides"

export const SHOW_HN_GUIDE: Guide = {
  slug: GUIDE_SLUGS.SHOW_HN,
  title: "How to Post a Show HN That Gets Traction",
  metaTitle: "How to Post a Show HN on Hacker News (Rules, Title & Timing)",
  description:
    "What qualifies for Show HN, how to write the title and first comment, when to post, and the mistakes that get Show HN posts flagged or ignored.",
  publishedOn: "2026-11-24",
  updatedOn: "2026-11-24",
  keywords: [
    "show hn",
    "how to post show hn",
    "show hn guidelines",
    "launch on hacker news",
    "hacker news launch",
    "show hn tips",
  ],
  keyTakeaways: [
    "Show HN is for something you made that people can try right now; landing pages, sign-up walls, newsletters and blog posts do not qualify.",
    "Start the title with 'Show HN:', then the name and a plain description of what it does, with no hype words.",
    "Post a first comment immediately explaining why you built it, how it works, and what feedback you want, then stay to answer questions for several hours.",
    "Never ask friends to upvote; Hacker News detects voting rings and penalises the post.",
  ],
  sections: [
    {
      heading: "What counts as a Show HN",
      body: `Hacker News' own rules describe Show HN as a way to share something you've made that other people can play with. In practice:

- **Qualifies:** a working app, open-source project, CLI, library, API, game or hardware project that readers can try or inspect.
- **Does not qualify:** landing pages, waitlists, sign-up-only products, fundraisers, newsletters, blog posts and lists. Post those as ordinary submissions or wait until there is something to try.

The fewer barriers the better. A live demo or a \`brew install\` line gets far more engagement than "request access".`,
    },
    {
      heading: "Write the title",
      body: `Format: **\`Show HN: Name – what it does, plainly\`**

- Good: \`Show HN: Pathwise – a self-hosted uptime monitor in a single Go binary\`
- Weak: \`Show HN: Pathwise – the revolutionary AI-powered future of monitoring\`

Mention the interesting technical angle if there is one (open source, local-first, written in Rust, no account needed). Hacker News readers click for substance, and moderators edit or penalise titles with superlatives.`,
    },
    {
      heading: "Write the first comment",
      body: `Post it yourself, right after submitting. Cover:

1. **Why you built it**: the specific problem, in one or two sentences.
2. **How it works**: stack, architecture, anything non-obvious. This is what HN discusses.
3. **What's free and what isn't**, stated plainly.
4. **What feedback you want**: "I'd love feedback on the query syntax" invites better replies than "let me know what you think".

Write as a builder talking to builders, not as marketing copy.`,
    },
    {
      heading: "When to post and what to expect",
      body: `- Post when you can stay online and reply for **at least four to six hours**. Fast, thoughtful replies keep the thread alive.
- Weekday mornings US Eastern time are a common choice because that is when most readers arrive, but competition is higher then too. A good post can do well at any time.
- If the post does not get traction, you may repost after a while; moderators sometimes invite good posts into the "second-chance pool".
- Expect blunt criticism. Answer technical objections with specifics, and thank people for bug reports.`,
    },
    {
      heading: "Mistakes that sink a Show HN",
      body: `- Asking friends, colleagues or a Slack group to upvote. Voting rings are detected and the post is penalised.
- Posting a sign-up wall or "coming soon" page.
- Arguing with critics instead of engaging with the point.
- Leaving the thread after an hour.
- Using the post purely as an ad, with no technical detail.`,
    },
    {
      heading: "Combine Show HN with other launch channels",
      body: `Show HN is one day of attention. Pair it with listings that keep working after the thread scrolls away: launch platforms with weekly leaderboards, category directories, and comparison pages. See [how to submit your startup](${ROUTES.GUIDE(GUIDE_SLUGS.SUBMIT_STARTUP)}) for the full checklist, or [launch on LaunchNests](${ROUTES.SUBMIT}) to get an indexed listing and a markdown version for AI agents on the same day.`,
    },
  ],
  faqs: [
    {
      question: "Can I post a Show HN for a SaaS with a free trial?",
      answer:
        "Yes, if people can try it right away. A trial that needs a credit card or a sales call is a barrier, and readers will say so; a free tier or a no-signup demo works best.",
    },
    {
      question: "How many upvotes does a Show HN need to reach the front page?",
      answer:
        "There is no fixed number. Ranking depends on votes, their timing, comments and moderation, so a post with steady early engagement can rank above one with more total votes.",
    },
    {
      question: "Can I post a Show HN more than once?",
      answer:
        "You can repost after a while if the first one got little attention, or when the project has changed significantly. Avoid reposting the same thing repeatedly.",
    },
  ],
  relatedLinks: [
    { label: "Show HN glossary entry", href: ROUTES.GLOSSARY_TERM("show-hn") },
    { label: "Product launch", href: ROUTES.GLOSSARY_TERM("product-launch") },
    {
      label: "Where to launch developer tools",
      href: ROUTES.GUIDE_LAUNCH_DEVTOOLS,
    },
    { label: "Product Hunt alternatives", href: ROUTES.PRODUCTHUNT_ALTERNATIVES },
  ],
}
