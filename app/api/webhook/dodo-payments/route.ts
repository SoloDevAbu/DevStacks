import { Webhooks } from "@dodopayments/nextjs"
import { db } from "@/db"
import { tools, products, launches } from "@/db/schema"
import { generateAndSaveLaunchBlog } from "@/lib/ai/launch-blog-service"
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
import { revalidateCatalog } from "@/lib/cache/revalidate"
import { getUserContact } from "@/db/queries/users/get-profile"
import { sendSubmissionReceivedEmail } from "@/lib/email/submission"
import { SUBMISSION_STATUS } from "@/constants/moderation"
import type { LaunchItemType } from "@/constants/launches"

const listingEmailColumns = (table: typeof tools | typeof products) => ({
  id: table.id,
  slug: table.slug,
  status: table.status,
  name: table.name,
  tier: table.tier,
  launchYear: table.launchYear,
  launchWeek: table.launchWeek,
})

type PaidListing = {
  id: string
  slug: string
  status: string
  name: string
  tier: string
  launchYear: number | null
  launchWeek: number | null
}

// A paid launch is created as a free listing before checkout, so its "we got your submission"
// email waits for the payment to land. Upgrades of already-reviewed listings send nothing.
const confirmPaidSubmission = async (
  userId: string | null,
  itemType: LaunchItemType,
  listing: PaidListing
) => {
  if (!userId || listing.status !== SUBMISSION_STATUS.PENDING) return
  const contact = await getUserContact(userId)
  if (!contact?.email) return
  await sendSubmissionReceivedEmail({ to: contact.email, listing: { ...listing, itemType } })
}

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

      const upgradedSlugs: { toolSlug?: string; productSlug?: string } = {}

      // Upgrade tool or product tier for listing payments
      if (payment.tier) {
        if (payment.toolId) {
          const [updatedTool] = await db
            .update(tools)
            .set({ tier: payment.tier, updatedAt: new Date() })
            .where(eq(tools.id, payment.toolId))
            .returning(listingEmailColumns(tools))

          await db
            .update(launches)
            .set({ tier: payment.tier, updatedAt: new Date() })
            .where(eq(launches.toolId, payment.toolId))

          upgradedSlugs.toolSlug = updatedTool?.slug
          if (updatedTool) await confirmPaidSubmission(payment.userId, "tool", updatedTool)

          // Auto-generate AI blog immediately ONLY if already approved by admin
          if (updatedTool?.status === "approved") {
            try {
              await generateAndSaveLaunchBlog({
                itemType: "tool",
                itemId: payment.toolId,
              })
            } catch (blogErr) {
              console.error("[Dodo Webhook] Error generating blog for tool:", blogErr)
            }
          }
        }

        if (payment.productId) {
          const [updatedProduct] = await db
            .update(products)
            .set({ tier: payment.tier, updatedAt: new Date() })
            .where(eq(products.id, payment.productId))
            .returning(listingEmailColumns(products))

          await db
            .update(launches)
            .set({ tier: payment.tier, updatedAt: new Date() })
            .where(eq(launches.productId, payment.productId))

          upgradedSlugs.productSlug = updatedProduct?.slug
          if (updatedProduct) {
            await confirmPaidSubmission(payment.userId, "product", updatedProduct)
          }

          // Auto-generate AI blog immediately ONLY if already approved by admin
          if (updatedProduct?.status === "approved") {
            try {
              await generateAndSaveLaunchBlog({
                itemType: "product",
                itemId: payment.productId,
              })
            } catch (blogErr) {
              console.error("[Dodo Webhook] Error generating blog for product:", blogErr)
            }
          }
        }
      }

      revalidateCatalog(upgradedSlugs)
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

        await db
          .update(launches)
          .set({ tier: "free", updatedAt: new Date() })
          .where(eq(launches.toolId, payment.toolId))
      }

      if (payment.productId) {
        await db
          .update(products)
          .set({ tier: "free", updatedAt: new Date() })
          .where(eq(products.id, payment.productId))

        await db
          .update(launches)
          .set({ tier: "free", updatedAt: new Date() })
          .where(eq(launches.productId, payment.productId))
      }
    }
  },
})
