import {
  ProductsDirectory,
  getProductsMetadata,
  type ProductsSearchParams,
} from "@/app/products/products-directory"

interface BrowseProductsPageProps {
  searchParams: Promise<ProductsSearchParams>
}

export const generateMetadata = async ({ searchParams }: BrowseProductsPageProps) =>
  getProductsMetadata(await searchParams)

const BrowseProductsPage = async ({ searchParams }: BrowseProductsPageProps) => (
  <ProductsDirectory searchParams={await searchParams} />
)

export default BrowseProductsPage
