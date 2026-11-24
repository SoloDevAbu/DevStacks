import Link from "next/link"
import { ROUTES } from "@/constants/routes"
import {
  getComparisonTitle,
  getComparisonsForTool,
} from "@/utils/tool-comparisons"
import {
  aboutSectionBlock,
  aboutSectionTitle,
  compareLinkList,
  compareLinkPill,
} from "@/utils/styles"

export const ToolComparisonLinks = ({
  toolSlug,
  toolName,
}: {
  toolSlug: string
  toolName: string
}) => {
  const comparisons = getComparisonsForTool(toolSlug)
  if (comparisons.length === 0) return null

  return (
    <section className={aboutSectionBlock}>
      <h2 className={aboutSectionTitle}>{toolName} head-to-head comparisons</h2>
      <ul className={compareLinkList}>
        {comparisons.map((comparison) => (
          <li key={comparison.slug}>
            <Link
              href={ROUTES.COMPARE(comparison.slug)}
              className={compareLinkPill}
            >
              {getComparisonTitle(comparison)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
