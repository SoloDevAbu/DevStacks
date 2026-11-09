import {
  BlogDirectory,
  getBlogMetadata,
  type BlogSearchParams,
} from "@/app/blog/blog-directory"

interface BrowseBlogPageProps {
  searchParams: Promise<BlogSearchParams>
}

export const generateMetadata = async ({ searchParams }: BrowseBlogPageProps) =>
  getBlogMetadata(await searchParams)

const BrowseBlogPage = async ({ searchParams }: BrowseBlogPageProps) => (
  <BlogDirectory searchParams={await searchParams} />
)

export default BrowseBlogPage
