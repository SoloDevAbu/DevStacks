import { db } from "@/db"
import { payments } from "@/db/schema"
import { and, eq, isNull, desc } from "drizzle-orm"
import type { Tier } from "@/constants/plans"

export interface UserListingCredit {
  id: string
  tier: Tier
  amount: number
  createdAt: Date
}

export const getUserAvailableListingCredit = async (
  userId: string
): Promise<UserListingCredit | null> => {
  const [credit] = await db
    .select({
      id: payments.id,
      tier: payments.tier,
      amount: payments.amount,
      createdAt: payments.createdAt,
    })
    .from(payments)
    .where(
      and(
        eq(payments.userId, userId),
        eq(payments.paymentType, "listing"),
        eq(payments.status, "succeeded"),
        isNull(payments.toolId),
        isNull(payments.productId)
      )
    )
    .orderBy(desc(payments.createdAt))
    .limit(1)

  if (!credit || !credit.tier) return null

  return {
    id: credit.id,
    tier: credit.tier as Tier,
    amount: credit.amount,
    createdAt: credit.createdAt,
  }
}

