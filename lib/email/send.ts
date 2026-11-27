import { RESEND_API_URL, type EmailTemplate } from "@/constants/email"
import { SITE_CONFIG } from "@/constants/site"

export type TemplateVariables = Record<string, string>

export const escapeHtml =(value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

// Resend inserts {{{VAR}}} unescaped, so user-written text goes in twice: raw for the subject and
// plain-text body, escaped as KEY_HTML for the HTML body.
export const withHtmlVariant = (key: string, value: string): TemplateVariables => ({
  [key]: value,
  [`${key}_HTML`]: escapeHtml(value),
})

interface TemplateEmail {
  to: string
  template: EmailTemplate
  variables: TemplateVariables
  // Same key within 24h never sends twice, so retries and duplicate webhooks are safe.
  idempotencyKey: string
}

// Never throws: email is a side effect and must not fail the request that triggered it.
export const sendTemplateEmail = async ({
  to,
  template,
  variables,
  idempotencyKey,
}: TemplateEmail) => {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM
  if (!apiKey || !from) {
    console.warn(`[Email] RESEND_API_KEY or EMAIL_FROM is not set; skipping "${template}".`)
    return
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: SITE_CONFIG.supportEmail,
        template: { id: template, variables },
      }),
    })
    if (!res.ok) {
      console.error(`[Email] Resend responded ${res.status} for "${template}": ${await res.text()}`)
    }
  } catch (err) {
    console.error(`[Email] Failed to send "${template}":`, err)
  }
}
