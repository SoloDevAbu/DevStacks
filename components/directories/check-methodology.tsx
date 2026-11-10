import { DIRECTORY_CHECK } from "@/constants/directories"
import { SITE_CONFIG } from "@/constants/site"
import {
  comparisonSectionSubtitle,
  comparisonSectionTitle,
} from "@/utils/styles"

const STEPS = [
  "For each directory we pick one real product listing and note the product's own website. Where that listing is on a paid plan or won a placement, the directory page says so.",
  `About every ${DIRECTORY_CHECK.INTERVAL_DAYS} days our checker downloads that listing page as plain HTML, the way a search engine's first pass sees it.`,
  "It looks for a link to the product's site. If the directory sends visitors through its own redirect (like /visit), it follows the redirects to confirm they end at the product, without loading the product's site.",
  'The link counts as dofollow unless it has rel="nofollow", "ugc" or "sponsored", or the page tells search engines not to follow its links.',
] as const

export const CheckMethodology = () => (
  <section id="methodology" className="flex flex-col gap-4">
    <div>
      <h2 className={comparisonSectionTitle}>How we check links</h2>
      <p className={comparisonSectionSubtitle}>
        Directories often say one thing about links and do another, so we
        measure instead of taking their word for it.
      </p>
    </div>
    <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
      {STEPS.map((step) => (
        <li key={step}>{step}</li>
      ))}
    </ol>
    <p className="text-sm leading-relaxed text-slate-600">
      One listing is a sample, not a guarantee: many directories give paid
      listings a dofollow link and free listings a nofollow one, so read the
      measured result next to the directory&apos;s stated policy. A link added
      by JavaScript, or a site that blocks our checker, shows as not measured
      rather than as a guess. The history keeps the last{" "}
      {DIRECTORY_CHECK.HISTORY_LIMIT} checks. {SITE_CONFIG.name} is one of the
      sites listed, and it is checked the same way.
    </p>
  </section>
)
