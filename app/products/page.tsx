import { ProductsDirectory, getProductsMetadata } from "./products-directory"

// The plain URL renders without reading the query, so it is served from the ISR cache. Filtered,
// searched and paginated URLs are rewritten by middleware.ts to app/browse/products, which
// renders per request.
export const revalidate = 3600

export const generateMetadata = () => getProductsMetadata({})

const ProductsPage = () => <ProductsDirectory searchParams={{}} />

export default ProductsPage
