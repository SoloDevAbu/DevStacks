import { GUIDES_HUB, GUIDES } from "@/constants/guides"
import { STANDALONE_GUIDE_LINKS } from "@/constants/internal-links"
import { ROUTES } from "@/constants/routes"
import { CREATOR_SOCIALS } from "@/constants/site"
import type { Guide } from "@/types/guides"
import { formatFactsCheckedOn } from "@/utils/alternatives"
import { toAbsoluteUrl } from "@/utils/urls"

export const getGuideUrl = (guide: Guide) => toAbsoluteUrl(ROUTES.GUIDE(guide.slug))

export const getGuideBody = (guide: Guide) =>
  guide.sections.map(({ heading, body }) => `## ${heading}\n\n${body}`).join("\n\n")

export const buildGuideByline = (guide: Guide) =>
  `By ${CREATOR_SOCIALS.name} · Updated ${formatFactsCheckedOn(guide.updatedOn)}`

export const buildGuideMarkdown = (guide: Guide) =>
  [
    `# ${guide.title}`,
    "",
    `> ${guide.description}`,
    "",
    `Canonical page: ${getGuideUrl(guide)}`,
    buildGuideByline(guide),
    "",
    "## Key takeaways",
    "",
    ...guide.keyTakeaways.map((point) => `- ${point}`),
    "",
    getGuideBody(guide),
    "",
    "## Frequently asked questions",
    "",
    ...guide.faqs.flatMap(({ question, answer }) => [`### ${question}`, "", answer, ""]),
    "## Related",
    "",
    ...guide.relatedLinks.map(({ label, href }) => `- [${label}](${toAbsoluteUrl(href)})`),
    "",
    `Part of ${GUIDES_HUB.title}: ${toAbsoluteUrl(ROUTES.GUIDES)}`,
    "",
  ].join("\n")

export const buildGuidesHubMarkdown = () =>
  [
    `# ${GUIDES_HUB.title}`,
    "",
    `> ${GUIDES_HUB.description}`,
    "",
    `Canonical page: ${toAbsoluteUrl(ROUTES.GUIDES)}`,
    "",
    "## Guides",
    "",
    ...GUIDES.map(
      (guide) =>
        `- [${guide.title}](${getGuideUrl(guide)}): ${guide.description} (markdown at ${ROUTES.GUIDE(guide.slug)}.md)`
    ),
    ...STANDALONE_GUIDE_LINKS.map(
      ({ href, title, description }) => `- [${title}](${toAbsoluteUrl(href)}): ${description}`
    ),
    "",
  ].join("\n")
