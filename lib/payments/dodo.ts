import { SITE_CONFIG } from "@/constants/site"

const getDodoBaseUrl = () =>
  process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode"
    ? "https://live.dodopayments.com"
    : "https://test.dodopayments.com"

export interface DodoProductCartItem {
  product_id: string
  quantity: number
  // Only for pay-what-you-want one-time products; otherwise omit.
  amount?: number // in smallest currency unit (e.g., cents)
}

export interface DodoCustomer {
  email: string
  name?: string
  phone_number?: string
}

export interface DodoBillingAddress {
  country: string // ISO 3166-1 alpha-2
  city?: string | null
  state?: string | null
  street?: string | null
  zipcode?: string | null
}

export interface DodoFeatureFlags {
  // If customer is allowed to change currency, set true (default true in Dodo).
  // For one-time fixed USD products, set false to avoid currency mismatch.
  allow_currency_selection?: boolean
}

export interface CreateCheckoutSessionParams {
  productCart: DodoProductCartItem[]
  customer: DodoCustomer
  returnUrl?: string
  cancelUrl?: string
  billingCurrency?: string // e.g. "USD"
  billingAddress?: DodoBillingAddress
  featureFlags?: DodoFeatureFlags
  metadata?: Record<string, string | number | boolean | null | undefined>
}

export interface DodoCheckoutSessionResponse {
  checkout_url: string | null
  session_id: string
}

export const createDodoCheckoutSession = async ({
  productCart,
  customer,
  returnUrl,
  cancelUrl,
  billingCurrency,
  billingAddress,
  featureFlags,
  metadata = {},
}: CreateCheckoutSessionParams): Promise<DodoCheckoutSessionResponse> => {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY

  if (!apiKey) {
    throw new Error(
      "DODO_PAYMENTS_API_KEY is not configured in environment variables."
    )
  }

  for (const item of productCart) {
    if (!item.product_id) {
      throw new Error(
        "Each item in productCart must specify a valid product_id."
      )
    }
    if (!item.quantity || item.quantity <= 0) {
      throw new Error("Each item in productCart must have quantity > 0.")
    }
  }

  const configuredReturnUrl = process.env.DODO_PAYMENTS_RETURN_URL
  const defaultReturnUrl = configuredReturnUrl
    ? configuredReturnUrl.replace(/\/$/, "")
    : SITE_CONFIG.url

  // Build payload following official docs
  const payload: Record<string, any> = {
    product_cart: productCart.map((it) => {
      const base: any = {
        product_id: it.product_id,
        quantity: it.quantity,
      }
      if (typeof it.amount === "number") {
        base.amount = it.amount
      }
      return base
    }),
    customer: {
      email: customer.email,
      name: customer.name || customer.email.split("@")[0],
      ...(customer.phone_number ? { phone_number: customer.phone_number } : {}),
    },
    return_url: returnUrl || defaultReturnUrl,
    metadata: Object.fromEntries(
      Object.entries(metadata)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => [k, String(v)])
    ),
  }

  if (cancelUrl) payload.cancel_url = cancelUrl
  if (billingCurrency) payload.billing_currency = billingCurrency
  if (billingAddress) payload.billing_address = billingAddress
  if (featureFlags) payload.feature_flags = featureFlags

  const res = await fetch(`${getDodoBaseUrl()}/checkouts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "")
    console.error(
      "Dodo Payments checkout creation failed:",
      res.status,
      errorBody
    )
    throw new Error(
      `Dodo checkout failed (${res.status}): ${errorBody || res.statusText}`
    )
  }

  const data = (await res.json()) as DodoCheckoutSessionResponse
  return data
}
