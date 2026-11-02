import Script from "next/script"

interface CloudflareAnalyticsProps {
  token?: string
}

export const CloudflareAnalytics = ({ token }: CloudflareAnalyticsProps) => {
  const analyticsToken =
    token || process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN

  if (!analyticsToken) {
    return null
  }

  return (
    <Script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({
        token: analyticsToken,
        spa: true,
      })}
      strategy="afterInteractive"
    />
  )
}

