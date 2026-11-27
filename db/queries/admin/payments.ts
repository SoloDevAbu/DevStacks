import { db } from "@/db"
import { payments, products, tools, users } from "@/db/schema"
import { and, count, desc, eq, gte, sum, type SQL } from "drizzle-orm"
import { ADMIN_PAGE_SIZE } from "@/constants/moderation"

type PaymentStatus = (typeof payments.$inferSelect)["status"]
type PaymentType = (typeof payments.$inferSelect)["paymentType"]

export const getAdminPayments = async ({
  status,
  paymentType,
  page = 1,
  pageSize = ADMIN_PAGE_SIZE,
}: {
  status?: PaymentStatus
  paymentType?: PaymentType
  page?: number
  pageSize?: number
} = {}) => {
  const conditions: SQL[] = []
  if (status) conditions.push(eq(payments.status, status))
  if (paymentType) conditions.push(eq(payments.paymentType, paymentType))
  const where = conditions.length ? and(...conditions) : undefined

  const [rows, [total]] = await Promise.all([
    db
      .select({
        id: payments.id,
        paymentType: payments.paymentType,
        tier: payments.tier,
        amount: payments.amount,
        currency: payments.currency,
        status: payments.status,
        dodoPaymentId: payments.dodoPaymentId,
        adId: payments.adId,
        createdAt: payments.createdAt,
        userEmail: users.email,
        toolName: tools.name,
        productName: products.name,
      })
      .from(payments)
      .innerJoin(users, eq(payments.userId, users.id))
      .leftJoin(tools, eq(payments.toolId, tools.id))
      .leftJoin(products, eq(payments.productId, products.id))
      .where(where)
      .orderBy(desc(payments.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ value: count() }).from(payments).where(where),
  ])

  return {
    rows: rows.map(({ toolName, productName, ...row }) => ({
      ...row,
      listingName: toolName ?? productName ?? null,
    })),
    total: total?.value ?? 0,
  }
}

export type AdminPaymentRow = Awaited<
  ReturnType<typeof getAdminPayments>
>["rows"][number]

export const sumSucceededPaymentsSince = async (since: Date) => {
  const [row] = await db
    .select({ value: sum(payments.amount) })
    .from(payments)
    .where(and(eq(payments.status, "succeeded"), gte(payments.createdAt, since)))
  return Number(row?.value ?? 0)
}
