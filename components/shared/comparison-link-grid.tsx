import Link from "next/link"
import { CornerBrackets } from "@/components/shared/corner-brackets"
import { ROUTES } from "@/constants/routes"
import {
  getComparisonTitle,
  type ToolComparison,
} from "@/utils/tool-comparisons"
import {
  dashedLinkGrid,
  dashedLinkGridItem,
  dashedLinkMeta,
  dashedLinkTitle,
} from "@/utils/styles"

export const ComparisonLinkGrid = ({
  comparisons,
}: {
  comparisons: readonly ToolComparison[]
}) => (
  <div className="relative">
    <CornerBrackets />
    <ul className={dashedLinkGrid}>
      {comparisons.map((comparison) => (
        <li key={comparison.slug}>
          <Link
            href={ROUTES.COMPARE(comparison.slug)}
            className={dashedLinkGridItem}
          >
            <span className={dashedLinkTitle}>
              {getComparisonTitle(comparison)} →
            </span>
            <span className={dashedLinkMeta}>{comparison.verdict}</span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
)
