import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { CornerBrackets } from "@/components/shared/corner-brackets"
import { LAUNCH_RESOURCE_LINKS } from "@/constants/internal-links"
import {
  comparisonSectionSubtitle,
  comparisonSectionTitle,
  relatedResourceCard,
} from "@/utils/styles"

interface RelatedResourcesProps {
  currentPath: string
  title?: string
}

export const RelatedResources = ({
  currentPath,
  title = "More launch guides",
}: RelatedResourcesProps) => {
  const links = LAUNCH_RESOURCE_LINKS.filter(({ href }) => href !== currentPath)

  return (
    <section className="flex flex-col gap-4" aria-labelledby="related-resources">
      <div>
        <h2 id="related-resources" className={comparisonSectionTitle}>
          {title}
        </h2>
        <p className={comparisonSectionSubtitle}>
          Guides and comparisons that help you decide where and how to launch.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {links.map(({ href, title: linkTitle, description }) => (
          <Link key={href} href={href} className={relatedResourceCard}>
            <CornerBrackets />
            <span className="flex items-center justify-between gap-2 text-sm font-bold text-slate-900 group-hover:text-indigo-600">
              {linkTitle}
              <ChevronRight className="size-4 shrink-0 text-slate-400 group-hover:text-indigo-600" />
            </span>
            <span className="text-xs leading-relaxed text-slate-600">
              {description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
