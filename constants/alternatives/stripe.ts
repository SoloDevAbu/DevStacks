import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const STRIPE_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "stripe",
  toolName: "Stripe",
  profile: {
    websiteUrl: "https://stripe.com",
    bestFor:
      "A payments platform for cards, wallets, subscriptions, invoicing and Connect marketplaces, billed per transaction.",
    license: "Commercial",
    pricing: PRICING.PAID,
    platforms: "Cloud",
  },
  intro:
    "Stripe is a payments platform with APIs for checkout, subscriptions, invoicing and payouts. The main split among alternatives is merchant of record versus payment processor: a merchant of record (Paddle, Lemon Squeezy, Polar, Dodo Payments) sells on your behalf and handles global sales tax, while processors (Adyen, Braintree, Square) leave tax and compliance with you.",
  stickWith: [
    "You want the broadest payment APIs and documentation with full control.",
    "You already handle sales tax registration, or Stripe Tax covers it.",
    "You use Connect, Billing or Terminal together.",
  ],
  switchWhen: [
    "You sell software globally and want someone else to collect and remit sales tax and VAT (Paddle, Lemon Squeezy, Polar, Dodo Payments).",
    "You process very high volumes and need enterprise acquiring (Adyen).",
    "You need in-person point of sale alongside online payments (Square).",
  ],
  factsCheckedOn: "2026-11-18",
  alternatives: [
    {
      name: "Paddle",
      websiteUrl: "https://www.paddle.com",
      bestFor:
        "A merchant of record for SaaS that handles billing, global tax and compliance.",
      license: "Commercial",
      pricing: PRICING.PAID,
      platforms: "Web, API",
      tags: ["Merchant of record", "SaaS billing"],
    },
    {
      name: "Lemon Squeezy",
      websiteUrl: "https://www.lemonsqueezy.com",
      bestFor:
        "A merchant of record for selling software and digital products, now part of Stripe.",
      license: "Commercial",
      pricing: PRICING.PAID,
      platforms: "Web, API",
      tags: ["Merchant of record", "Digital products"],
    },
    {
      name: "Polar",
      websiteUrl: "https://polar.sh",
      bestFor:
        "An open-source merchant of record for developers selling software and subscriptions.",
      license: "Open Source",
      pricing: PRICING.PAID,
      platforms: "Web, API",
      tags: ["Merchant of record", "Developers"],
    },
    {
      name: "Dodo Payments",
      websiteUrl: "https://dodopayments.com",
      bestFor:
        "A merchant of record for SaaS and digital products with global tax handling.",
      license: "Commercial",
      pricing: PRICING.PAID,
      platforms: "Web, API",
      tags: ["Merchant of record", "Global tax"],
    },
    {
      name: "Adyen",
      websiteUrl: "https://www.adyen.com",
      bestFor:
        "Enterprise payment processing across online, mobile and in-store channels.",
      license: "Commercial",
      pricing: PRICING.PAID,
      platforms: "Web, Mobile, In-store",
      tags: ["Enterprise", "Omnichannel"],
    },
    {
      name: "Braintree",
      websiteUrl: "https://www.braintreepayments.com",
      bestFor:
        "PayPal's processor for cards, PayPal and Venmo in one integration.",
      license: "Commercial",
      pricing: PRICING.PAID,
      platforms: "Web, Mobile",
      tags: ["PayPal", "Cards"],
    },
    {
      name: "Square",
      websiteUrl: "https://squareup.com",
      bestFor:
        "Online and in-person payments for businesses that also sell at a physical counter.",
      license: "Commercial",
      pricing: PRICING.PAID,
      platforms: "Web, Mobile, Point of sale",
      tags: ["Point of sale", "Small business"],
    },
  ],
}
