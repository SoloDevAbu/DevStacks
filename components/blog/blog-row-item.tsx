import Link from "next/link"
import { Calendar, Clock } from "lucide-react"
import { ProductLogo } from "@/components/shared/product-logo"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"
import {
  blogRowItem,
  blogRowLeft,
  blogBigLogoWrapper,
  blogRowContent,
  blogRowTitle,
  blogRowExcerpt,
  blogRowMeta,
  blogRowCtaWrapper,
} from "@/utils/blog/styles"
import type { BlogListItem } from "@/types/blog"

export interface BlogRowItemProps extends BlogListItem {}

export const BlogRowItem = ({
  blog,
  tool,
  product,
  submitter,
}: BlogRowItemProps) => {
  const item = tool || product
  const logoUrl = item?.logoUrl || blog.coverImageUrl
  const logoFallbackText = (item?.name || "LN").slice(0, 2).toUpperCase()

  const formattedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : new Date(blog.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })

  const makerAvatar = submitter?.avatarUrl || submitter?.image
  const makerName = submitter?.name || "LaunchNests Editorial"
  const makerUsername = submitter?.username

  return (
    <article className={blogRowItem}>
      <div className={blogRowLeft}>
        {/* Big Logo */}
        <Link
          href={ROUTES.BLOG_POST(blog.slug)}
          className={blogBigLogoWrapper}
          title={blog.title}
        >
          <ProductLogo
            text={logoFallbackText}
            imageUrl={logoUrl}
            websiteUrl={item?.websiteUrl}
            alt={item?.name || blog.title}
            className="size-full"
          />
        </Link>

        {/* Content Area: Title, Excerpt, Meta */}
        <div className={blogRowContent}>
          <Link href={ROUTES.BLOG_POST(blog.slug)}>
            <h2 className={blogRowTitle}>{blog.title}</h2>
          </Link>

          <p className={blogRowExcerpt}>{blog.excerpt}</p>

          <div className={blogRowMeta}>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5 text-slate-400 shrink-0" />
              <span>{formattedDate}</span>
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5 text-slate-400 shrink-0" />
              <span>{blog.readingTimeMinutes || 5} min read</span>
            </span>
            <span>·</span>

            {/* Maker: Small logo and name with redirect to maker profile */}
            {makerUsername ? (
              <Link
                href={ROUTES.MAKER(makerUsername)}
                className="inline-flex items-center gap-1.5 font-semibold text-slate-700 transition-colors hover:text-slate-900 hover:underline"
              >
                <Avatar size="sm" className="size-4.5">
                  {makerAvatar && (
                    <AvatarImage src={makerAvatar} alt={makerName} />
                  )}
                  <AvatarFallback className="text-[10px] font-bold">
                    {makerName.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{makerName}</span>
              </Link>
            ) : (
              <div className="inline-flex items-center gap-1.5 text-slate-600">
                <Avatar size="sm" className="size-4.5">
                  {makerAvatar && (
                    <AvatarImage src={makerAvatar} alt={makerName} />
                  )}
                  <AvatarFallback className="text-[10px] font-bold">
                    {makerName.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{makerName}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side: CTA Button */}
      <div className={blogRowCtaWrapper}>
        <Button
          size="default"
          nativeButton={false}
          render={<Link href={ROUTES.BLOG_POST(blog.slug)} />}
          className="w-full sm:w-auto font-semibold text-xs"
        >
          Read Full Blog
        </Button>
      </div>
    </article>
  )
}

