import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { checkoutRequestSchema } from "@/lib/validation/payment"
import { getAdTierConfig } from "@/constants/ads"
import { PLANS, type Tier } from "@/constants/plans"
import { createAd } from "@/db/queries/ads"
import { createPayment, updatePaymentStatus } from "@/db/queries/payments"
import { createDodoCheckoutSession } from "@/lib/payments/dodo"

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
      const {
        placement,
        duration,
        title,
        description,
        badgeText,
        imageUrl,
        ctaText,
        ctaUrl,
      } = parsed.data

      const tierConfig = getAdTierConfig(placement, duration)

      // 1. Create ad in pending_payment status
      const ad = await createAd({
        userId: user.id,
        placement,
        title,
        description,
        badgeText: badgeText || "PROMOTED",
        imageUrl: imageUrl || null,
        ctaText: ctaText || "Learn More",
        ctaUrl,
        status: "pending_payment",
        durationDays: tierConfig.days,
      })

      // 2. Create pending payment record
      const payment = await createPayment({
        userId: user.id,
        paymentType: "ad",
        adId: ad.id,
        amount: tierConfig.priceInCents,
        currency: "USD",
        status: "pending",
        metadata: JSON.stringify({
          placement,
          duration,
          adId: ad.id,
          title,
        }),
      })

      // 3. Create Dodo Payments checkout session
      const productCartItem = tierConfig.dodoProductId
        ? {
            product_id: tierConfig.dodoProductId,
            quantity: 1,
            amount: tierConfig.priceInCents,
          }
        : {
            quantity: 1,
            amount: tierConfig.priceInCents,
          }

      const dodoSession = await createDodoCheckoutSession({
        productCart: [productCartItem],
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
          duration,
        },
      })

      // 4. Record session id
      await updatePaymentStatus({
        id: payment.id,
        status: "pending",
        dodoCustomerId: undefined,
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

    // 1. Create pending payment record
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

    // 2. Create Dodo Payments checkout session
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
    const message =
      error instanceof Error ? error.message : "Failed to initiate checkout"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
