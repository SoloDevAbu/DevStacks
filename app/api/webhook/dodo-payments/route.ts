import { Webhooks } from "@dodopayments/nextjs"
import { db } from "@/db"
import { tools, products } from "@/db/schema"
import { eq } from "drizzle-orm"
import {
  getPaymentById,
  getPaymentByDodoPaymentId,
  updatePaymentStatus,
} from "@/db/queries/payments"
import {
  getAdById,
  updateAdStatus,
  activateAdWeeks,
  deactivateAdWeeks,
} from "@/db/queries/ads"
import type { Tier } from "@/constants/plans"

interface DodoWebhookData {
  payment_id?: string
  total_amount?: number
  currency?: string
  customer?: {
    customer_id?: string
    email?: string
    name?: string
  }
  metadata?: Record<string, string | undefined>
}

interface DodoWebhookPayload {
  business_id?: string
  type?: string
  timestamp?: string
  data?: DodoWebhookData
}

const getWebhookKey = () => {
  const key = process.env.DODO_PAYMENTS_WEBHOOK_SECRET
  if (!key) {
    throw new Error("DODO_PAYMENTS_WEBHOOK_SECRET is not configured")
  }
  return key
}

export const POST = Webhooks({
  webhookKey: getWebhookKey(),

  onPaymentSucceeded: async (rawPayload: unknown) => {
    const payload = rawPayload as DodoWebhookPayload
    const data = payload?.data
    if (!data) return

    const dodoPaymentId = data.payment_id
    const dodoCustomerId = data.customer?.customer_id
    const metadata = data.metadata || {}
    const paymentId = metadata.paymentId

    let payment = paymentId ? await getPaymentById(paymentId) : null
    if (!payment && dodoPaymentId) {
      payment = await getPaymentByDodoPaymentId(dodoPaymentId)
    }

    if (payment) {
      // Guard: only process if still pending (prevents replayed webhooks)
      if (payment.status !== "pending") {
        console.warn(
          `Webhook skipped: payment ${payment.id} already has status "${payment.status}"`
        )
        return
      }

      // Guard: verify the paid amount matches expected amount only when currencies align
      const paidCurrency = data.currency?.toUpperCase?.()
      const expectedCurrency = payment.currency?.toUpperCase?.()
      if (
        data.total_amount !== undefined &&
        paidCurrency &&
        expectedCurrency &&
        paidCurrency === expectedCurrency &&
        data.total_amount < payment.amount
      ) {
        console.error(
          `Amount mismatch for payment ${payment.id}: expected ${payment.amount} ${expectedCurrency}, got ${data.total_amount} ${paidCurrency}`
        )
        await updatePaymentStatus({
          id: payment.id,
          status: "failed",
          dodoPaymentId,
        })
        return
      } else if (
        data.total_amount !== undefined &&
        paidCurrency &&
        expectedCurrency &&
        paidCurrency !== expectedCurrency
      ) {
        console.warn(
          `Skipping amount comparison for payment ${payment.id} due to currency mismatch: expected ${expectedCurrency}, got ${paidCurrency}`
        )
      }

      await updatePaymentStatus({
        id: payment.id,
        status: "succeeded",
        dodoPaymentId,
        dodoCustomerId,
      })

      // Activate ad weeks if this is an ad payment
      const adId = payment.adId || metadata.adId
      if (adId) {
        const ad = await getAdById(adId)
        if (ad) {
          await activateAdWeeks(adId)
          await updateAdStatus(adId, "active")

          // Apply tier bonus if applicable
          if (ad.tierBonusApplied) {
            const tierToApply = ad.tierBonusApplied as Tier

            if (ad.toolId) {
              await db
                .update(tools)
                .set({ tier: tierToApply, updatedAt: new Date() })
                .where(eq(tools.id, ad.toolId))
            }

            if (ad.productId) {
              await db
                .update(products)
                .set({ tier: tierToApply, updatedAt: new Date() })
                .where(eq(products.id, ad.productId))
            }
          }
        }
      }

      // Upgrade tool or product tier for listing payments
      if (payment.tier) {
        if (payment.toolId) {
          await db
            .update(tools)
            .set({ tier: payment.tier, updatedAt: new Date() })
            .where(eq(tools.id, payment.toolId))
        }

        if (payment.productId) {
          await db
            .update(products)
            .set({ tier: payment.tier, updatedAt: new Date() })
            .where(eq(products.id, payment.productId))
        }
      }
    }
  },

  onPaymentFailed: async (rawPayload: unknown) => {
    const payload = rawPayload as DodoWebhookPayload
    const data = payload?.data
    if (!data) return

    const dodoPaymentId = data.payment_id
    const paymentId = data.metadata?.paymentId

    let payment = paymentId ? await getPaymentById(paymentId) : null
    if (!payment && dodoPaymentId) {
      payment = await getPaymentByDodoPaymentId(dodoPaymentId)
    }

    if (payment) {
      await updatePaymentStatus({
        id: payment.id,
        status: "failed",
        dodoPaymentId,
      })

      if (payment.adId) {
        await deactivateAdWeeks(payment.adId)
        await updateAdStatus(payment.adId, "paused")
      }
    }
  },

  onRefundSucceeded: async (rawPayload: unknown) => {
    const payload = rawPayload as DodoWebhookPayload
    const data = payload?.data
    if (!data) return

    const dodoPaymentId = data.payment_id
    const paymentId = data.metadata?.paymentId

    let payment = paymentId ? await getPaymentById(paymentId) : null
    if (!payment && dodoPaymentId) {
      payment = await getPaymentByDodoPaymentId(dodoPaymentId)
    }

    if (payment) {
      await updatePaymentStatus({
        id: payment.id,
        status: "refunded",
        dodoPaymentId,
      })

      if (payment.adId) {
        await deactivateAdWeeks(payment.adId)
        await updateAdStatus(payment.adId, "paused")
      }

      if (payment.toolId) {
        await db
          .update(tools)
          .set({ tier: "free", updatedAt: new Date() })
          .where(eq(tools.id, payment.toolId))
      }

      if (payment.productId) {
        await db
          .update(products)
          .set({ tier: "free", updatedAt: new Date() })
          .where(eq(products.id, payment.productId))
      }
    }
  },
})
