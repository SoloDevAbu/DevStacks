import {
  ToolsDirectory,
  getToolsMetadata,
  type ToolsSearchParams,
} from "@/app/tools/tools-directory"

interface BrowseToolsPageProps {
  searchParams: Promise<ToolsSearchParams>
}

export const generateMetadata = async ({ searchParams }: BrowseToolsPageProps) =>
  getToolsMetadata(await searchParams)

const BrowseToolsPage = async ({ searchParams }: BrowseToolsPageProps) => (
  <ToolsDirectory searchParams={await searchParams} />
)

export default BrowseToolsPage
