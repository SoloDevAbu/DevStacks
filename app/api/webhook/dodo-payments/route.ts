import { Webhooks } from "@dodopayments/nextjs"
import { db } from "@/db"
import { tools, products } from "@/db/schema"
import { eq } from "drizzle-orm"
import {
  getPaymentById,
  getPaymentByDodoPaymentId,
  updatePaymentStatus,
} from "@/db/queries/payments"
import { getAdById, updateAdStatus } from "@/db/queries/ads"

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

export const POST = Webhooks({
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_SECRET || "",

  onPaymentSucceeded: async (rawPayload: unknown) => {
    const payload = rawPayload as DodoWebhookPayload
    const data = payload?.data
    if (!data) return

    const dodoPaymentId = data.payment_id
    const dodoCustomerId = data.customer?.customer_id
    const metadata = data.metadata || {}
    const paymentId = metadata.paymentId

    // 1. Find internal payment record
    let payment = paymentId ? await getPaymentById(paymentId) : null
    if (!payment && dodoPaymentId) {
      payment = await getPaymentByDodoPaymentId(dodoPaymentId)
    }

    if (payment) {
      // Mark payment as succeeded
      await updatePaymentStatus({
        id: payment.id,
        status: "succeeded",
        dodoPaymentId,
        dodoCustomerId,
      })

      // 2. Activate Ad if it is an ad payment
      const adId = payment.adId || metadata.adId
      if (adId) {
        const ad = await getAdById(adId)
        if (ad) {
          const startDate = new Date()
          const durationDays = ad.durationDays || 30
          const endDate = new Date(
            startDate.getTime() + durationDays * 24 * 60 * 60 * 1000
          )

          await updateAdStatus(ad.id, "active", {
            startDate,
            endDate,
          })
        }
      }

      // 3. Upgrade Tool or Product tier if it is a listing payment
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
        await updateAdStatus(payment.adId, "pending_payment")
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
