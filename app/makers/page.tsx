import { MakersDirectory, getMakersMetadata } from "./makers-directory"

// The plain URL renders without reading the query, so it is served from the ISR cache. Paginated
// URLs are rewritten by middleware.ts to app/browse/makers, which renders per request.
export const revalidate = 86400

export const generateMetadata = () => getMakersMetadata({})

const MakersPage = () => <MakersDirectory searchParams={{}} />

export default MakersPage
