import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth/admin"
import { getAdminAuditLog } from "@/db/queries/admin/audit"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminAuditTable } from "@/components/admin/admin-audit-table"
import { CrawlablePagination } from "@/components/shared/crawlable-pagination"
import { ROUTES } from "@/constants/routes"
import { ADMIN_PAGE_SIZE } from "@/constants/moderation"
import { readPage, totalPages, type AdminSearchParams } from "@/utils/admin/search-params"
import { adminPagination } from "@/utils/admin/styles"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Audit log" }

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>
}) {
  await requireAdmin()
  const page = readPage(await searchParams)
  const { rows, total } = await getAdminAuditLog({ page })

  return (
    <>
      <AdminPageHeader
        title="Audit log"
        description="Every admin action, with who took it. Entries can't be edited or deleted from the panel."
      />
      <AdminAuditTable rows={rows} />
      <div className={adminPagination}>
        <CrawlablePagination
          currentPage={page}
          totalPages={totalPages(total, ADMIN_PAGE_SIZE)}
          basePath={ROUTES.ADMIN_AUDIT}
        />
      </div>
    </>
  )
}
