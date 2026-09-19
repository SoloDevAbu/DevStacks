import { SITE_CONFIG } from "@/constants/site"

const getDodoBaseUrl = () =>
  process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode"
    ? "https://live.dodopayments.com"
    : "https://test.dodopayments.com"

export interface DodoProductCartItem {
  product_id?: string
  quantity: number
  amount?: number // in cents
}

export interface DodoCustomer {
  email: string
  name?: string
  phone_number?: string
}

export interface CreateCheckoutSessionParams {
  productCart: DodoProductCartItem[]
  customer: DodoCustomer
  returnUrl?: string
  metadata?: Record<string, string | number | boolean | null | undefined>
}

export interface DodoCheckoutSessionResponse {
  checkout_url: string
  session_id: string
}

export const createDodoCheckoutSession = async ({
  productCart,
  customer,
  returnUrl,
  metadata = {},
}: CreateCheckoutSessionParams): Promise<DodoCheckoutSessionResponse> => {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY

  if (!apiKey) {
    throw new Error(
      "DODO_PAYMENTS_API_KEY is not configured in environment variables."
    )
  }

  const defaultReturnUrl =
    process.env.DODO_PAYMENTS_RETURN_URL || `${SITE_CONFIG.url}/checkout/success`

  const payload = {
    product_cart: productCart,
    customer: {
      email: customer.email,
      name: customer.name || customer.email.split("@")[0],
    },
    return_url: returnUrl || defaultReturnUrl,
    metadata: Object.fromEntries(
      Object.entries(metadata)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => [k, String(v)])
    ),
  }

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
    console.error("Dodo Payments checkout creation failed:", res.status, errorBody)
    throw new Error(
      `Failed to create Dodo Payments checkout session (${res.status}): ${errorBody}`
    )
  }

  const data = (await res.json()) as DodoCheckoutSessionResponse
  return data
}
