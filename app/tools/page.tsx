import { ToolsDirectory, getToolsMetadata } from "./tools-directory"

// The plain URL renders without reading the query, so it is served from the ISR cache. Filtered,
// searched and paginated URLs are rewritten by middleware.ts to app/browse/tools, which
// renders per request.
export const revalidate = 86400

export const generateMetadata = () => getToolsMetadata({})

const ToolsPage = () => <ToolsDirectory searchParams={{}} />

export default ToolsPage
