import { db } from "@/db"
import { payments } from "@/db/schema"
import type { Payment, NewPayment } from "@/db/schema"
import { eq, desc, and } from "drizzle-orm"

export type PaymentStatus =
  | "pending"
  | "succeeded"
  | "failed"
  | "refunded"
  | "cancelled"

export const createPayment = async (
  data: NewPayment,
  client: any = db
): Promise<Payment> => {
  const [payment] = await client.insert(payments).values(data).returning()
  return payment
}

export const getPaymentByIdempotencyKey = async (
  idempotencyKey: string,
  userId: string
): Promise<Payment | null> => {
  const [payment] = await db
    .select()
    .from(payments)
    .where(
      and(
        eq(payments.idempotencyKey, idempotencyKey),
        eq(payments.userId, userId)
      )
    )
    .limit(1)

  return payment ?? null
}

export const updatePaymentDodoSession = async ({
  id,
  dodoCheckoutSessionId,
  checkoutUrl,
}: {
  id: string
  dodoCheckoutSessionId: string
  checkoutUrl?: string | null
}): Promise<Payment | null> => {
  const [updated] = await db
    .update(payments)
    .set({
      dodoCheckoutSessionId,
      checkoutUrl,
      updatedAt: new Date(),
    })
    .where(eq(payments.id, id))
    .returning()

  return updated ?? null
}

export const getPaymentById = async (id: string): Promise<Payment | null> => {
  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.id, id))
    .limit(1)

  return payment ?? null
}

export const getPaymentByDodoPaymentId = async (
  dodoPaymentId: string
): Promise<Payment | null> => {
  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.dodoPaymentId, dodoPaymentId))
    .limit(1)

  return payment ?? null
}

export const getPaymentByCheckoutSessionId = async (
  dodoCheckoutSessionId: string
): Promise<Payment | null> => {
  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.dodoCheckoutSessionId, dodoCheckoutSessionId))
    .limit(1)

  return payment ?? null
}

export const updatePaymentStatus = async ({
  id,
  status,
  dodoPaymentId,
  dodoCustomerId,
}: {
  id: string
  status: PaymentStatus
  dodoPaymentId?: string
  dodoCustomerId?: string
}): Promise<Payment | null> => {
  const updateData: Partial<NewPayment> = {
    status,
    updatedAt: new Date(),
  }

  if (dodoPaymentId) {
    updateData.dodoPaymentId = dodoPaymentId
  }

  if (dodoCustomerId) {
    updateData.dodoCustomerId = dodoCustomerId
  }

  const [updated] = await db
    .update(payments)
    .set(updateData)
    .where(eq(payments.id, id))
    .returning()

  return updated ?? null
}

export const getUserPayments = async (userId: string): Promise<Payment[]> => {
  return db
    .select()
    .from(payments)
    .where(eq(payments.userId, userId))
    .orderBy(desc(payments.createdAt))
}
