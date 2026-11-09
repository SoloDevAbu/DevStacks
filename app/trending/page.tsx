import { TrendingDirectory, getTrendingMetadata } from "./trending-directory"

// The plain URL renders without reading the query, so it is served from the ISR cache. Filtered,
// searched and paginated URLs are rewritten by middleware.ts to app/browse/trending, which
// renders per request.
export const revalidate = 3600

export const generateMetadata = () => getTrendingMetadata({})

const TrendingPage = () => <TrendingDirectory searchParams={{}} />

export default TrendingPage
