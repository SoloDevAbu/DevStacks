import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"

export interface RefundItem {
  id: string
  number: number
  title: string
  content: string
  bulletPoints?: string[]
}

export interface RefundCategory {
  id: string
  title: string
  description: string
  headerThemeKey: "directory" | "protocols" | "legal"
  items: RefundItem[]
}

export const REFUND_LAST_UPDATED = "September 19, 2026"

export const REFUND_CATEGORIES: RefundCategory[] = [
  {
    id: "directory-policy-and-free-submissions",
    title: "Directory Policy & Free Submissions",
    description:
      "Overview of platform pricing, 100% free directory submissions, and our promotional status.",
    headerThemeKey: "directory",
    items: [
      {
        id: "policy-overview",
        number: 1,
        title: "Overview & Service Scope",
        content: `Submitting and listing developer tools, APIs, and software products on ${SITE_CONFIG.name} is completely free — no credit card is required, and there are no hidden listing fees.\n\nPaid services on ${SITE_CONFIG.name} are strictly limited to optional high-impact promotional units (such as persistent sidebar sponsorships and featured category spotlight rails). Because these units represent time-bound digital advertising inventory reserved exclusively for the buyer and delivered immediately upon schedule activation, purchases are generally non-refundable once an ad run commences. Limited good-faith exceptions are detailed below.\n\nThis policy should be reviewed in conjunction with our Terms of Service (${ROUTES.TERMS}) and Pricing page (${ROUTES.PRICING}).`,
      },
      {
        id: "free-directory-listings",
        number: 2,
        title: "Directory Listings & Temporary Launch Offer",
        content: `Standard directory listings on ${SITE_CONFIG.name} are 100% free. There is nothing to charge and nothing to refund for standard directory submissions.\n\nAs a temporary, limited-time launch offer, the First 50 approved launches receive a complimentary Lifetime Premium listing upgrade (including verified badge, priority placement, and Do-Follow backlinks) at no cost. Once the first 50 launch slots are filled, standard directory submissions will remain free, while optional Premium and Premium+ listing verification tiers will return to their regular paid pricing. Because the launch tier upgrade is gifted at $0 during this promotional period, no refund is applicable. In the event that paid listing upgrades are purchased after the promotional period, if a submission is rejected during editorial review before publication, the listing fee is refunded in full.`,
      },
    ],
  },
  {
    id: "sponsorship-terms-and-rules",
    title: "Sponsorship Terms & Cancellation Rules",
    description:
      "Slot reservation terms, cancellation windows, technical failure remedies, and accidental charge rules.",
    headerThemeKey: "protocols",
    items: [
      {
        id: "sidebar-sponsorships",
        number: 3,
        title: "Sidebar Sponsorships & Slot Reservations",
        content: `Sidebar sponsorships reserve an exclusive promotional placement visible across ${SITE_CONFIG.name} browsing feeds and detail profiles for a defined period (weekly or monthly). Because booked inventory is withheld from other advertisers, the following rules apply:`,
        bulletPoints: [
          "Cancellations 7+ Days Prior: You may request a 100% full refund if cancellation is requested in writing at least 7 full calendar days before your scheduled campaign start date, allowing our team time to reallocate the inventory.",
          "Cancellations Less Than 7 Days Prior: Cancellations made fewer than 7 days before the start date are non-refundable, as the ad slot has been reserved and other advertisers declined.",
          "Active / Live Campaigns: Once a sponsored placement period begins and the campaign goes live, fees are non-refundable. Promotional value is actively delivered to our developer audience.",
          "Technical Delivery Failure: If ${SITE_CONFIG.name} fails to render an approved sponsorship unit within 24 hours of the scheduled start date due to technical downtime or system error, we will either extend the placement period by equivalent downtime or issue a full refund at the advertiser's discretion.",
          "Duplicate or Erroneous Charges: In the event of an accidental duplicate transaction or billing error, notify us within 14 days of the charge with your transaction ID for an immediate full refund.",
        ],
      },
      {
        id: "listing-rejection-after-payment",
        number: 4,
        title: "Listing Rejection After Sponsorship Payment",
        content: `If an advertiser purchases a sponsored promotional boost tied to a specific tool or product submission, and that listing is subsequently rejected during editorial review for violating technical standards, malware policies, or Terms of Service, the advertiser is eligible for a full refund of the promotional fee, provided the ad unit never went live.`,
      },
    ],
  },
  {
    id: "integrity-disputes-and-consumer-rights",
    title: "Integrity, Disputes & Consumer Rights",
    description:
      "Zero-tolerance abuse rules, chargeback procedures, refund request workflows, and statutory protections.",
    headerThemeKey: "legal",
    items: [
      {
        id: "fraud-and-policy-violations",
        number: 5,
        title: "Fraud, Bot Manipulation & Policy Violations",
        content: `Refund exceptions and satisfaction guarantees do not apply if an account or sponsored listing is suspended or terminated for violating ${SITE_CONFIG.name}'s Terms of Service or community integrity standards:`,
        bulletPoints: [
          "Artificially inflating upvotes, likes, or build counts through bots, click farms, or coordinated voting rings.",
          "Submitting deceptive links, malicious redirects, spyware, or fraudulent software.",
          "Using unauthorized or stolen payment credentials.",
          "Filing bad-faith payment disputes or fraudulent chargebacks.",
          "Where such abuse occurs, listings will be immediately removed, active ad slots revoked, and all refund eligibility permanently forfeited.",
        ],
      },
      {
        id: "chargebacks-and-disputes",
        number: 6,
        title: "Chargebacks & Payment Dispute Resolution",
        content: `We request that advertisers contact our support team before initiating a bank chargeback or dispute. The ${SITE_CONFIG.name} team is responsive and committed to resolving billing discrepancies quickly and amicably.\n\nInitiating a chargeback without prior communication may result in immediate suspension of active advertising placements and temporary restriction of associated maker accounts pending dispute review. This does not limit any rights you hold under applicable consumer protection legislation.`,
      },
      {
        id: "how-to-request-refund",
        number: 7,
        title: "How to Request a Refund",
        content: `To request a refund under the qualifying exceptions outlined in this policy, please email support@${SITE_CONFIG.domain} with the subject line "Refund Request" and include the following details:`,
        bulletPoints: [
          "Account email address used to book the sponsorship.",
          "Sponsorship tier or placement type purchased.",
          "Date of purchase and invoice / transaction ID.",
          "Detailed explanation of the reason for the refund request.",
          "Our team reviews all refund requests within 5 business days. Approved refunds are credited directly back to the original payment method.",
        ],
      },
      {
        id: "statutory-consumer-rights",
        number: 8,
        title: "Statutory Consumer Rights",
        content: `Nothing in this Refund & Cancellation Policy is intended to exclude, restrict, or modify any non-waivable statutory rights or remedies available under consumer protection legislation in your jurisdiction (such as the Consumer Protection Act in India or applicable EU / UK distance-selling regulations). Where statutory law mandates a refund right, that right prevails to the extent required.`,
      },
      {
        id: "changes-and-inquiries",
        number: 9,
        title: "Policy Updates & Billing Inquiries",
        content: `We may revise this Refund & Cancellation Policy periodically as our platform features and sponsorship offerings evolve. The "Last updated" date at the top of this document indicates the current effective version.\n\nFor billing questions, invoice receipts, or sponsorship inquiries:`,
        bulletPoints: [
          `Email: support@${SITE_CONFIG.domain}`,
          `X / Twitter: ${SITE_CONFIG.socials.x}`,
          `Pricing Page: ${SITE_CONFIG.url}/pricing`,
          `Canonical URL: ${SITE_CONFIG.url}/refund`,
        ],
      },
    ],
  },
]

export const ALL_REFUND_ITEMS = REFUND_CATEGORIES.flatMap((cat) => cat.items)
