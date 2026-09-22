import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { getToolBySlug } from "@/db/queries/tools/get"
import { ToolEditForm } from "@/components/dashboard/tool-edit-form"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"

export const metadata: Metadata = {
  title: `Edit Tool — ${SITE_CONFIG.name}`,
  robots: {
    index: false,
    follow: false,
  },
}

interface ToolEditPageProps {
  params: Promise<{ slug: string }>
}

const ToolEditPage = async ({ params }: ToolEditPageProps) => {
  const { slug } = await params
  const reqHeaders = await headers()
  const session = await auth.api.getSession({
    headers: reqHeaders,
  })

  if (!session?.user?.id) {
    redirect(ROUTES.HOME)
  }

  const tool = await getToolBySlug(slug)

  if (!tool) {
    notFound()
  }

  if (tool.submitterId !== session.user.id) {
    redirect(ROUTES.DASHBOARD_TOOLS)
  }

  return <ToolEditForm tool={tool as any} />
}

export default ToolEditPage
