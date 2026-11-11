import { BlogDirectory, getBlogMetadata } from "./blog-directory"

// The plain URL renders without reading the query, so it is served from the ISR cache. Filtered,
// searched and paginated URLs are rewritten by middleware.ts to app/browse/blog, which
// renders per request.
export const revalidate = 86400

export const generateMetadata = () => getBlogMetadata({})

const BlogIndexPage = () => <BlogDirectory searchParams={{}} />

export default BlogIndexPage
