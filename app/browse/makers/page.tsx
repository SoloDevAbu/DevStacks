import {
  MakersDirectory,
  getMakersMetadata,
  type MakersSearchParams,
} from "@/app/makers/makers-directory"

interface BrowseMakersPageProps {
  searchParams: Promise<MakersSearchParams>
}

export const generateMetadata = async ({
  searchParams,
}: BrowseMakersPageProps) => getMakersMetadata(await searchParams)

const BrowseMakersPage = async ({ searchParams }: BrowseMakersPageProps) => (
  <MakersDirectory searchParams={await searchParams} />
)

export default BrowseMakersPage
