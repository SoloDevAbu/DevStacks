import Link from "next/link"
import { FolderOpen, Wrench } from "lucide-react"
import { ROUTES } from "@/constants/routes"
import type { ProductBuiltWith } from "@/types/entities"
import { getCategoryPath } from "@/utils/urls"
import { techStackChipLink } from "@/utils/styles"

interface BlogContextLinksProps {
  itemName: string
  itemKind: "tool" | "product"
  builtWithTools: ProductBuiltWith[]
  category?: { name: string; slug: string } | null
}

// Links come from the listing's own data, not from the generated article text, so they always
// point at pages that exist.
export const BlogContextLinks = ({
  itemName,
  itemKind,
  builtWithTools,
  category,
}: BlogContextLinksProps) => {
  const linkedTools = builtWithTools.filter(
    (tool): tool is ProductBuiltWith & { toolSlug: string } =>
      Boolean(tool.toolSlug)
  )
  if (linkedTools.length === 0 && !category) return null

  return (
    <section
      id="tech-stack-links"
      className="flex scroll-mt-24 flex-col gap-4 border-b border-dashed border-border px-6 py-6 sm:px-8 md:px-10"
    >
      {linkedTools.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <h2 className="text-sm font-bold text-slate-900">
            Tools {itemName} is built with
          </h2>
          <div className="flex flex-wrap gap-2">
            {linkedTools.map((tool) => (
              <Link
                key={tool.toolSlug}
                href={ROUTES.TOOL(tool.toolSlug)}
                className={techStackChipLink}
              >
                <Wrench className="size-3.5 text-indigo-600" />
                <span>{tool.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
      {category && (
        <p className="text-xs text-slate-600">
          More in{" "}
          <Link
            href={getCategoryPath(itemKind, category.slug)}
            className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <FolderOpen className="size-3.5" />
            {category.name}
          </Link>
        </p>
      )}
    </section>
  )
}
