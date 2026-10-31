import Link from "next/link"
import Image from "next/image"
import { Clock, Star, ArrowRight, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  blogCardWrapper,
  blogCardMetaBar,
  blogCardTitle,
  blogCardExcerpt,
  blogCardFooter,
} from "@/utils/blog/styles"
import type { Blog, Tool, Product } from "@/db/schema"

export interface BlogCardProps {
  blog: Blog
  tool?: Tool | null
  product?: Product | null
}

export const BlogCard = ({ blog, tool, product }: BlogCardProps) => {
  const item = tool || product
  const rating = blog.verdictRating ? Number(blog.verdictRating).toFixed(1) : null

  return (
    <article className={blogCardWrapper}>
      <div>
        {/* Meta Bar */}
        <div className={blogCardMetaBar}>
          <span className="flex items-center gap-1 font-medium text-indigo-600">
            <Sparkles className="size-3" />
            Launch Spotlight
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3 text-slate-400" />
            {blog.readingTimeMinutes} min read
          </span>
          {rating && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-600 font-semibold">
                <Star className="size-3 fill-amber-500 text-amber-500" />
                {rating}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <Link href={`/blog/${blog.slug}`} className="block">
          <h2 className={blogCardTitle}>{blog.title}</h2>
        </Link>

        {/* Excerpt */}
        <p className={blogCardExcerpt}>{blog.excerpt}</p>
      </div>

      {/* Footer */}
      <div className={blogCardFooter}>
        <div className="flex items-center gap-2">
          {item?.logoUrl ? (
            <div className="relative size-6 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white">
              <Image
                src={item.logoUrl}
                alt={item.name}
                fill
                className="object-contain p-0.5"
                unoptimized
              />
            </div>
          ) : null}
          <span className="text-xs font-semibold text-slate-800">
            {item?.name || "Featured Launch"}
          </span>
        </div>

        <Link
          href={`/blog/${blog.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform"
        >
          <span>Read Review</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </article>
  )
}

