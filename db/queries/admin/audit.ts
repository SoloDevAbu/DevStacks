import { db } from "@/db"
import { adminAuditLog, users } from "@/db/schema"
import { count, desc, eq } from "drizzle-orm"
import type { AdminAuditAction, AdminAuditTarget } from "@/constants/admin"
import { ADMIN_PAGE_SIZE } from "@/constants/moderation"

export const recordAdminAction = async (entry: {
  adminId: string
  action: AdminAuditAction
  targetType: AdminAuditTarget
  targetId: string
  metadata?: Record<string, unknown>
}) => {
  await db.insert(adminAuditLog).values(entry)
}

export const getAdminAuditLog = async ({
  page = 1,
  pageSize = ADMIN_PAGE_SIZE,
}: { page?: number; pageSize?: number } = {}) => {
  const [rows, [total]] = await Promise.all([
    db
      .select({
        id: adminAuditLog.id,
        action: adminAuditLog.action,
        targetType: adminAuditLog.targetType,
        targetId: adminAuditLog.targetId,
        metadata: adminAuditLog.metadata,
        createdAt: adminAuditLog.createdAt,
        adminEmail: users.email,
        adminName: users.name,
      })
      .from(adminAuditLog)
      .innerJoin(users, eq(adminAuditLog.adminId, users.id))
      .orderBy(desc(adminAuditLog.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ value: count() }).from(adminAuditLog),
  ])
  return { rows, total: total?.value ?? 0 }
}

export type AdminAuditRow = Awaited<
  ReturnType<typeof getAdminAuditLog>
>["rows"][number]
