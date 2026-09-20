import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { checkoutRequestSchema } from "@/lib/validation/payment"
import {
  AD_PRICING,
  AD_SLOTS_PER_WEEK,
  AD_MAX_WEEKS_PER_PRODUCT,
  AD_TIER_BONUS,
  AD_EXISTING_TIER_DISCOUNT,
  type AdPlacement,
} from "@/constants/ads"
import { PLANS, TIER, type Tier } from "@/constants/plans"
import {
  createAd,
  createAdWeeks,
  getProductAdWeekCount,
} from "@/db/queries/ads"
import { getWeekAvailability } from "@/db/queries/ads/availability"
import { createPayment, updatePaymentStatus } from "@/db/queries/payments"
import { createDodoCheckoutSession } from "@/lib/payments/dodo"
import { getISOWeekRange } from "@/utils/iso-weeks"
import { db } from "@/db"
import { tools, products } from "@/db/schema"
import { eq } from "drizzle-orm"

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers })

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to proceed with payment." },
        { status: 401 }
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

    const user = session.user

    if (parsed.data.paymentType === "ad") {
      const { placement, toolId, productId, selectedWeeks, ctaText } =
        parsed.data

      // Validate the linked submission belongs to the user
      if (toolId) {
        const [tool] = await db
          .select({
            id: tools.id,
            submitterId: tools.submitterId,
            tier: tools.tier,
            status: tools.status,
          })
          .from(tools)
          .where(eq(tools.id, toolId))
          .limit(1)

        if (!tool || tool.submitterId !== user.id || tool.status !== "approved") {
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
            tier: products.tier,
            status: products.status,
          })
          .from(products)
          .where(eq(products.id, productId))
          .limit(1)

        if (!product || product.submitterId !== user.id || product.status !== "approved") {
          return NextResponse.json(
            { error: "Product not found, not owned by you, or not yet approved" },
            { status: 403 }
          )
        }
      }

      // Check 6-week cap per product+placement
      const existingWeekCount = await getProductAdWeekCount({
        placement: placement as AdPlacement,
        toolId: toolId ?? null,
        productId: productId ?? null,
      })

      if (existingWeekCount + selectedWeeks.length > AD_MAX_WEEKS_PER_PRODUCT) {
        return NextResponse.json(
          {
            error: `Maximum ${AD_MAX_WEEKS_PER_PRODUCT} weeks allowed per product per placement. You have ${existingWeekCount} weeks already booked.`,
          },
          { status: 400 }
        )
      }

      // Validate slot availability for selected weeks
      const availability = await getWeekAvailability(placement as AdPlacement)
      const availabilityMap = new Map(
        availability.map((w) => [`${w.isoYear}-${w.isoWeek}`, w])
      )

      for (const week of selectedWeeks) {
        const key = `${week.isoYear}-${week.isoWeek}`
        const weekInfo = availabilityMap.get(key)

        if (!weekInfo || weekInfo.slotsRemaining <= 0) {
          return NextResponse.json(
            {
              error: `Week ${week.isoWeek} of ${week.isoYear} has no available slots`,
            },
            { status: 400 }
          )
        }
      }

      // Calculate pricing
      const pricing = AD_PRICING[placement as AdPlacement]
      const weekCount = selectedWeeks.length
      const subtotalInCents = weekCount * pricing.pricePerWeekInCents

      // Determine tier bonus
      let tierBonusApplied: Tier | null = null
      if (weekCount >= AD_TIER_BONUS.PREMIUM_PLUS_THRESHOLD) {
        tierBonusApplied = TIER.PREMIUM_PLUS
      } else if (weekCount >= AD_TIER_BONUS.PREMIUM_THRESHOLD) {
        tierBonusApplied = TIER.PREMIUM
      }

      // Calculate discount for existing tier holders
      let discountInCents = 0
      const itemTier = await getItemCurrentTier(toolId, productId)

      if (tierBonusApplied && itemTier) {
        if (itemTier === TIER.PREMIUM_PLUS) {
          // Has Premium+ already — $19 discount for 6 weeks, $15 for 4+
          discountInCents =
            weekCount >= AD_TIER_BONUS.PREMIUM_PLUS_THRESHOLD
              ? AD_EXISTING_TIER_DISCOUNT.PREMIUM_PLUS
              : weekCount >= AD_TIER_BONUS.PREMIUM_THRESHOLD
                ? AD_EXISTING_TIER_DISCOUNT.PREMIUM
                : 0
        } else if (itemTier === TIER.PREMIUM) {
          // Has Premium already — $15 discount for 4+ weeks
          discountInCents =
            weekCount >= AD_TIER_BONUS.PREMIUM_THRESHOLD
              ? AD_EXISTING_TIER_DISCOUNT.PREMIUM
              : 0
        }
      }

      const totalInCents = Math.max(0, subtotalInCents - discountInCents)

      // Create ad record
      const ad = await createAd({
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
      })

      // Create ad_weeks records
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

      await createAdWeeks(adWeekRecords)

      // Create payment record
      const payment = await createPayment({
        userId: user.id,
        paymentType: "ad",
        adId: ad.id,
        toolId: toolId ?? null,
        productId: productId ?? null,
        amount: totalInCents,
        currency: "USD",
        status: "pending",
        metadata: JSON.stringify({
          placement,
          weekCount,
          selectedWeeks,
          adId: ad.id,
          tierBonusApplied,
          discountInCents,
        }),
      })

      // Create Dodo checkout session
      const dodoSession = await createDodoCheckoutSession({
        productCart: [
          {
            quantity: 1,
            amount: totalInCents,
          },
        ],
        customer: {
          email: user.email,
          name: user.name,
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

      return NextResponse.json({
        checkoutUrl: dodoSession.checkout_url,
        sessionId: dodoSession.session_id,
        paymentId: payment.id,
        adId: ad.id,
      })
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
    } else {
      const [product] = await db
        .select({
          id: products.id,
          submitterId: products.submitterId,
          status: products.status,
        })
        .from(products)
        .where(eq(products.id, itemId))
        .limit(1)

      if (!product || product.submitterId !== user.id || product.status !== "approved") {
        return NextResponse.json(
          { error: "Product not found, not owned by you, or not yet approved" },
          { status: 403 }
        )
      }
    }

    const payment = await createPayment({
      userId: user.id,
      paymentType: "listing",
      tier: tier as Tier,
      toolId: itemType === "tool" ? itemId : null,
      productId: itemType === "product" ? itemId : null,
      amount: plan.priceInCents,
      currency: "USD",
      status: "pending",
      metadata: JSON.stringify({
        itemType,
        itemId,
        tier,
      }),
    })

    const productCartItem = plan.dodoProductId
      ? {
          product_id: plan.dodoProductId,
          quantity: 1,
          amount: plan.priceInCents,
        }
      : {
          quantity: 1,
          amount: plan.priceInCents,
        }

    const dodoSession = await createDodoCheckoutSession({
      productCart: [productCartItem],
      customer: {
        email: user.email,
        name: user.name,
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

    return NextResponse.json({
      checkoutUrl: dodoSession.checkout_url,
      sessionId: dodoSession.session_id,
      paymentId: payment.id,
    })
  } catch (error) {
    console.error("Checkout creation error:", error)
    return NextResponse.json(
      { error: "Something went wrong while creating your checkout session. Please try again." },
      { status: 500 }
    )
  }
}

const getItemCurrentTier = async (
  toolId?: string,
  productId?: string
): Promise<Tier | null> => {
  if (toolId) {
    const [tool] = await db
      .select({ tier: tools.tier })
      .from(tools)
      .where(eq(tools.id, toolId))
      .limit(1)
    return (tool?.tier as Tier) ?? null
  }
  if (productId) {
    const [product] = await db
      .select({ tier: products.tier })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1)
    return (product?.tier as Tier) ?? null
  }
  return null
}
