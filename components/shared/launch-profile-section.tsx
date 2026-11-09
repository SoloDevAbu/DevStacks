import Link from "next/link"
import { ChevronRight, Newspaper } from "lucide-react"
import { DetailSectionHeader } from "@/components/shared/detail-section-header"
import { BLOG_ARTICLE_LABEL } from "@/constants/blog"
import { ROUTES } from "@/constants/routes"
import { relatedResourceCard } from "@/utils/styles"

interface LaunchProfileSectionProps {
  itemName: string
  blog: {
    slug: string
    title: string
    excerpt?: string | null
  }
}

export const LaunchProfileSection = ({
  itemName,
  blog,
}: LaunchProfileSectionProps) => (
  <section className="border-b border-dashed border-border bg-white">
    <DetailSectionHeader
      title="Launch Profile"
      subtitle={`A longer write-up of ${itemName}: what it does, who it is for and how it is built`}
      icon={Newspaper}
      theme="indigo"
    />
    <div className="p-6 md:p-8">
      <Link href={ROUTES.BLOG_POST(blog.slug)} className={relatedResourceCard}>
        <span className="font-mono text-[11px] font-semibold tracking-wider text-indigo-600 uppercase">
          {BLOG_ARTICLE_LABEL}
        </span>
        <span className="flex items-center justify-between gap-2 text-sm font-bold text-slate-900 group-hover:text-indigo-600">
          {blog.title}
          <ChevronRight className="size-4 shrink-0 text-slate-400 group-hover:text-indigo-600" />
        </span>
        {blog.excerpt && (
          <span className="line-clamp-2 text-xs leading-relaxed text-slate-600">
            {blog.excerpt}
          </span>
        )}
      </Link>
    </div>
  </section>
)
