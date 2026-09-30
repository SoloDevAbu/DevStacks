import { redirect } from "next/navigation"
import { ROUTES } from "@/constants/routes"

type ShowcasePageProps = {
  searchParams?: Promise<{ tool?: string; toolSlug?: string }>
}

const ShowcasePage = async (props: ShowcasePageProps) => {
  const searchParams = props.searchParams ? await props.searchParams : undefined
  const toolSlugOrName = searchParams?.tool ?? searchParams?.toolSlug

  if (toolSlugOrName) {
    redirect(ROUTES.SUBMIT_PRODUCT_WITH_TOOL(toolSlugOrName))
  }

  redirect(ROUTES.SUBMIT_PRODUCT)
}

export default ShowcasePage
