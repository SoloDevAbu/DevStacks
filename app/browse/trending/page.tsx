import {
  TrendingDirectory,
  getTrendingMetadata,
  type TrendingSearchParams,
} from "@/app/trending/trending-directory"

interface BrowseTrendingPageProps {
  searchParams: Promise<TrendingSearchParams>
}

export const generateMetadata = async ({ searchParams }: BrowseTrendingPageProps) =>
  getTrendingMetadata(await searchParams)

const BrowseTrendingPage = async ({ searchParams }: BrowseTrendingPageProps) => (
  <TrendingDirectory searchParams={await searchParams} />
)

export default BrowseTrendingPage
