import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { checkoutRequestSchema } from "@/lib/validation/payment"
import {
  AD_PRICING,
  AD_SLOTS_PER_WEEK,
  AD_MAX_WEEKS_PER_PRODUCT,
  AD_TIER_BONUS,
  AD_EXISTING_TIER_DISCOUNT,
  AD_HOLD_DURATION_MINUTES,
  AD_TRACKING_RATE_LIMIT,
  type AdPlacement,
  getAdDodoProductId,
} from "@/constants/ads"
import { PLANS, TIER, type Tier, getPlanDodoProductId } from "@/constants/plans"
import {
  createAd,
  createAdWeeks,
  getProductAdWeekCount,
  updateAdStatus,
  deactivateAdWeeks,
} from "@/db/queries/ads"
import {
  createPayment,
  updatePaymentStatus,
  getPaymentByIdempotencyKey,
  updatePaymentDodoSession,
} from "@/db/queries/payments"
import { createDodoCheckoutSession } from "@/lib/payments/dodo"
import { getISOWeekRange } from "@/utils/iso-weeks"
import { db } from "@/db"
import { tools, products, adWeeks } from "@/db/schema"
import { eq, and, sql } from "drizzle-orm"
import { getClientIp, isRateLimited } from "@/lib/rate-limit"

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers })

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to proceed with payment." },
        { status: 401 }
      )
    }

    const user = session.user
    const ip = getClientIp(req)

    if (
      isRateLimited(
        `checkout:${user.id}:${ip}`,
        AD_TRACKING_RATE_LIMIT.CHECKOUT_WINDOW_MS,
        AD_TRACKING_RATE_LIMIT.CHECKOUT_MAX_ATTEMPTS
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Too many checkout requests. Please wait a moment before trying again.",
        },
        { status: 429 }
      )
    }

    const body = await req.json()
    const parsed = checkoutRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const idempotencyKey =
      req.headers.get("x-idempotency-key") ||
      req.headers.get("idempotency-key") ||
      parsed.data.idempotencyKey ||
      null

    if (idempotencyKey) {
      const existingPayment = await getPaymentByIdempotencyKey(
        idempotencyKey,
        user.id
      )
      if (existingPayment) {
        if (existingPayment.status === "succeeded") {
          return NextResponse.json(
            { error: "This payment has already been completed." },
            { status: 400 }
          )
        }
        if (
          existingPayment.checkoutUrl &&
          existingPayment.dodoCheckoutSessionId
        ) {
          return NextResponse.json({
            checkoutUrl: existingPayment.checkoutUrl,
            sessionId: existingPayment.dodoCheckoutSessionId,
            paymentId: existingPayment.id,
            adId: existingPayment.adId ?? undefined,
          })
        }
      }
    }

    if (parsed.data.paymentType === "ad") {
      const { placement, toolId, productId, selectedWeeks, ctaText } =
        parsed.data

      // Validate the linked submission belongs to the user
      if (toolId) {
        const [tool] = await db
          .select({
            id: tools.id,
            submitterId: tools.submitterId,
            status: tools.status,
          })
          .from(tools)
          .where(eq(tools.id, toolId))
          .limit(1)

        if (
          !tool ||
          tool.submitterId !== user.id ||
          tool.status !== "approved"
        ) {
          return NextResponse.json(
            { error: "Tool not found, not owned by you, or not yet approved" },
            { status: 403 }
          )
        }
      }

      if (productId) {
        const [product] = await db
          .select({
            id: products.id,
            submitterId: products.submitterId,
            status: products.status,
          })
          .from(products)
          .where(eq(products.id, productId))
          .limit(1)

        if (
          !product ||
          product.submitterId !== user.id ||
          product.status !== "approved"
        ) {
          return NextResponse.json(
            {
              error: "Product not found, not owned by you, or not yet approved",
            },
            { status: 403 }
          )
        }
      }

      // Sort weeks deterministically to prevent deadlocks when locking
      const sortedWeeks = [...selectedWeeks].sort((a, b) =>
        a.isoYear !== b.isoYear ? a.isoYear - b.isoYear : a.isoWeek - b.isoWeek
      )

      // Transaction: Advisory lock weeks, verify capacity, and insert ad + ad_weeks + payment atomically
      let dbResult
      try {
        dbResult = await db.transaction(async (tx) => {
          // 1. Acquire transaction-level advisory locks & check real-time availability
          for (const week of sortedWeeks) {
            await tx.execute(
              sql`SELECT pg_advisory_xact_lock(hashtext(${`ad_slot:${placement}:${week.isoYear}:${week.isoWeek}`}))`
            )

            const [slotResult] = await tx
              .select({ count: sql<number>`count(${adWeeks.id})::int` })
              .from(adWeeks)
              .where(
                and(
                  eq(adWeeks.placement, placement as AdPlacement),
                  eq(adWeeks.isoYear, week.isoYear),
                  eq(adWeeks.isoWeek, week.isoWeek),
                  sql`(${adWeeks.status} = 'active' OR (${adWeeks.status} = 'pending_payment' AND ${adWeeks.createdAt} > NOW() - (${AD_HOLD_DURATION_MINUTES} || ' minutes')::interval))`
                )
              )

            const usedSlots = slotResult?.count ?? 0
            if (usedSlots >= AD_SLOTS_PER_WEEK) {
              throw new Error(`WEEK_FULL:${week.isoYear}:${week.isoWeek}`)
            }
          }

          // 2. Check 6-week cap per product+placement inside transaction
          const existingWeekCount = await getProductAdWeekCount(
            {
              placement: placement as AdPlacement,
              toolId: toolId ?? null,
              productId: productId ?? null,
            },
            tx
          )

          if (
            existingWeekCount + selectedWeeks.length >
            AD_MAX_WEEKS_PER_PRODUCT
          ) {
            throw new Error(`PRODUCT_CAP_EXCEEDED:${existingWeekCount}`)
          }

          // 3. Calculate pricing & discounts inside transaction
          const pricing = AD_PRICING[placement as AdPlacement]
          const weekCount = selectedWeeks.length
          const subtotalInCents = weekCount * pricing.pricePerWeekInCents

          let tierBonusApplied: Tier | null = null
          if (weekCount >= AD_TIER_BONUS.PREMIUM_PLUS_THRESHOLD) {
            tierBonusApplied = TIER.PREMIUM_PLUS
          } else if (weekCount >= AD_TIER_BONUS.PREMIUM_THRESHOLD) {
            tierBonusApplied = TIER.PREMIUM
          }

          let discountInCents = 0
          const itemTier = await getItemCurrentTier(toolId, productId, tx)

          if (tierBonusApplied && itemTier) {
            if (itemTier === TIER.PREMIUM_PLUS) {
              discountInCents =
                weekCount >= AD_TIER_BONUS.PREMIUM_PLUS_THRESHOLD
                  ? AD_EXISTING_TIER_DISCOUNT.PREMIUM_PLUS
                  : weekCount >= AD_TIER_BONUS.PREMIUM_THRESHOLD
                    ? AD_EXISTING_TIER_DISCOUNT.PREMIUM
                    : 0
            } else if (itemTier === TIER.PREMIUM) {
              discountInCents =
                weekCount >= AD_TIER_BONUS.PREMIUM_THRESHOLD
                  ? AD_EXISTING_TIER_DISCOUNT.PREMIUM
                  : 0
            }
          }

          const totalInCents = Math.max(0, subtotalInCents - discountInCents)

          // 4. Create ad record
          const ad = await createAd(
            {
              userId: user.id,
              toolId: toolId ?? null,
              productId: productId ?? null,
              placement: placement as AdPlacement,
              ctaText: ctaText || "Learn More",
              status: "pending_payment",
              totalWeeks: weekCount,
              totalAmount: totalInCents,
              discountAmount: discountInCents,
              tierBonusApplied: tierBonusApplied as Tier | undefined,
            },
            tx
          )

          // 5. Create ad_weeks records
          const adWeekRecords = selectedWeeks.map((w) => {
            const { startDate, endDate } = getISOWeekRange(w.isoYear, w.isoWeek)
            return {
              adId: ad.id,
              placement: placement as AdPlacement,
              isoYear: w.isoYear,
              isoWeek: w.isoWeek,
              startDate,
              endDate,
              status: "pending_payment" as const,
            }
          })

          await createAdWeeks(adWeekRecords, tx)

          // 6. Create payment record
          const payment = await createPayment(
            {
              userId: user.id,
              paymentType: "ad",
              adId: ad.id,
              toolId: toolId ?? null,
              productId: productId ?? null,
              tier: tierBonusApplied ?? null,
              amount: totalInCents,
              currency: "USD",
              status: "pending",
              idempotencyKey: idempotencyKey ?? undefined,
              metadata: JSON.stringify({
                placement,
                weekCount,
                selectedWeeks,
                adId: ad.id,
                tierBonusApplied,
                discountInCents,
              }),
            },
            tx
          )

          return {
            ad,
            payment,
            totalInCents,
            weekCount,
            tierBonusApplied,
          }
        })
      } catch (txError: any) {
        if (typeof txError?.message === "string") {
          if (txError.message.startsWith("WEEK_FULL:")) {
            const [, yr, wk] = txError.message.split(":")
            return NextResponse.json(
              {
                error: `Week ${wk} of ${yr} was just booked and has no remaining slots. Please choose another week.`,
              },
              { status: 400 }
            )
          }
          if (txError.message.startsWith("PRODUCT_CAP_EXCEEDED:")) {
            const [, count] = txError.message.split(":")
            return NextResponse.json(
              {
                error: `Maximum ${AD_MAX_WEEKS_PER_PRODUCT} weeks allowed per product per placement. You have ${count} weeks already booked.`,
              },
              { status: 400 }
            )
          }
        }

        // Check if unique constraint on idempotency key caused error
        if (idempotencyKey && txError?.code === "23505") {
          const existing = await getPaymentByIdempotencyKey(
            idempotencyKey,
            user.id
          )
          if (existing?.checkoutUrl && existing.dodoCheckoutSessionId) {
            return NextResponse.json({
              checkoutUrl: existing.checkoutUrl,
              sessionId: existing.dodoCheckoutSessionId,
              paymentId: existing.id,
              adId: existing.adId ?? undefined,
            })
          }
        }

        throw txError
      }

      const { ad, payment, totalInCents, weekCount, tierBonusApplied } =
        dbResult

      const adProductId = getAdDodoProductId(placement as AdPlacement)

      if (!adProductId) {
        console.error(`Missing Dodo Product ID for placement: ${placement}`)
        await updatePaymentStatus({ id: payment.id, status: "failed" })
        await updateAdStatus(ad.id, "paused")
        await deactivateAdWeeks(ad.id)
        return NextResponse.json(
          {
            error:
              "Ad product configuration is missing. Please contact support.",
          },
          { status: 500 }
        )
      }

      // External Dodo checkout call (executed outside DB transaction)
      try {
        const dodoSession = await createDodoCheckoutSession({
          productCart: [
            {
              product_id: adProductId,
              quantity: weekCount,
            },
          ],
          customer: {
            email: user.email,
            name: user.name,
          },
          billingCurrency: "USD",
          featureFlags: {
            allow_currency_selection: false,
          },
          metadata: {
            paymentId: payment.id,
            adId: ad.id,
            userId: user.id,
            paymentType: "ad",
            placement,
            weekCount,
            tierBonusApplied: tierBonusApplied ?? "",
          },
        })

        await updatePaymentDodoSession({
          id: payment.id,
          dodoCheckoutSessionId: dodoSession.session_id,
          checkoutUrl: dodoSession.checkout_url,
        })

        return NextResponse.json({
          checkoutUrl: dodoSession.checkout_url,
          sessionId: dodoSession.session_id,
          paymentId: payment.id,
          adId: ad.id,
        })
      } catch (dodoError) {
        console.error("Dodo session creation error:", dodoError)
        await updatePaymentStatus({ id: payment.id, status: "failed" })
        await updateAdStatus(ad.id, "paused")
        await deactivateAdWeeks(ad.id)
        return NextResponse.json(
          {
            error:
              "Unable to reach payment provider. Please try again in a few moments.",
          },
          { status: 502 }
        )
      }
    }

    // Listing payment (Premium / Premium+)
    const { itemType, itemId, tier } = parsed.data
    const plan = PLANS[tier as Tier]

    if (!plan || plan.priceInCents <= 0) {
      return NextResponse.json(
        { error: "Invalid plan selected for listing checkout" },
        { status: 400 }
      )
    }

    // Verify ownership and approval status of the item being upgraded
    if (itemType === "tool") {
      const [tool] = await db
        .select({
          id: tools.id,
          submitterId: tools.submitterId,
          status: tools.status,
          tier: tools.tier,
        })
        .from(tools)
        .where(eq(tools.id, itemId))
        .limit(1)

      if (!tool || tool.submitterId !== user.id || tool.status !== "approved") {
        return NextResponse.json(
          { error: "Tool not found, not owned by you, or not yet approved" },
          { status: 403 }
        )
      }

      if (tool.tier === tier) {
        return NextResponse.json(
          { error: `This tool is already on the ${plan.name} tier.` },
          { status: 400 }
        )
      }
    } else {
      const [product] = await db
        .select({
          id: products.id,
          submitterId: products.submitterId,
          status: products.status,
          tier: products.tier,
        })
        .from(products)
        .where(eq(products.id, itemId))
        .limit(1)

      if (
        !product ||
        product.submitterId !== user.id ||
        product.status !== "approved"
      ) {
        return NextResponse.json(
          { error: "Product not found, not owned by you, or not yet approved" },
          { status: 403 }
        )
      }

      if (product.tier === tier) {
        return NextResponse.json(
          { error: `This product is already on the ${plan.name} tier.` },
          { status: 400 }
        )
      }
    }

    let payment
    try {
      payment = await db.transaction(async (tx) => {
        return await createPayment(
          {
            userId: user.id,
            paymentType: "listing",
            tier: tier as Tier,
            toolId: itemType === "tool" ? itemId : null,
            productId: itemType === "product" ? itemId : null,
            amount: plan.priceInCents,
            currency: "USD",
            status: "pending",
            idempotencyKey: idempotencyKey ?? undefined,
            metadata: JSON.stringify({
              itemType,
              itemId,
              tier,
            }),
          },
          tx
        )
      })
    } catch (txError: any) {
      if (idempotencyKey && txError?.code === "23505") {
        const existing = await getPaymentByIdempotencyKey(
          idempotencyKey,
          user.id
        )
        if (existing?.checkoutUrl && existing.dodoCheckoutSessionId) {
          return NextResponse.json({
            checkoutUrl: existing.checkoutUrl,
            sessionId: existing.dodoCheckoutSessionId,
            paymentId: existing.id,
          })
        }
      }
      throw txError
    }

    const listingProductId = getPlanDodoProductId(tier as Tier)

    if (!listingProductId) {
      console.error(`Missing Dodo Product ID for plan tier: ${tier}`)
      await updatePaymentStatus({ id: payment.id, status: "failed" })
      return NextResponse.json(
        {
          error:
            "Listing plan configuration is missing. Please contact support.",
        },
        { status: 500 }
      )
    }

    try {
      const productCartItem = {
        product_id: listingProductId,
        quantity: 1,
      }

      const dodoSession = await createDodoCheckoutSession({
        productCart: [productCartItem],
        customer: {
          email: user.email,
          name: user.name,
        },
        billingCurrency: "USD",
        featureFlags: {
          allow_currency_selection: false,
        },
        metadata: {
          paymentId: payment.id,
          userId: user.id,
          paymentType: "listing",
          itemType,
          itemId,
          tier,
        },
      })

      await updatePaymentDodoSession({
        id: payment.id,
        dodoCheckoutSessionId: dodoSession.session_id,
        checkoutUrl: dodoSession.checkout_url,
      })

      return NextResponse.json({
        checkoutUrl: dodoSession.checkout_url,
        sessionId: dodoSession.session_id,
        paymentId: payment.id,
      })
    } catch (dodoError) {
      console.error("Dodo session creation error:", dodoError)
      await updatePaymentStatus({ id: payment.id, status: "failed" })
      return NextResponse.json(
        {
          error:
            "Unable to reach payment provider. Please try again in a few moments.",
        },
        { status: 502 }
      )
    }
  } catch (error) {
    console.error("Checkout creation error:", error)
    return NextResponse.json(
      {
        error:
          "Something went wrong while creating your checkout session. Please try again.",
      },
      { status: 500 }
    )
  }
}

const getItemCurrentTier = async (
  toolId?: string,
  productId?: string,
  client: any = db
): Promise<Tier | null> => {
  if (toolId) {
    const [tool] = await client
      .select({ tier: tools.tier })
      .from(tools)
      .where(eq(tools.id, toolId))
      .limit(1)
    return (tool?.tier as Tier) ?? null
  }
  if (productId) {
    const [product] = await client
      .select({ tier: products.tier })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1)
    return (product?.tier as Tier) ?? null
  }
  return null
}
