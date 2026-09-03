const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://buymynextlaunch.com"

export type ProductSchemaInput = {
  name: string
  description: string
  url: string
  logoUrl?: string | null
  keywords?: string | null
  pricing?: string
  asoCategory?: string | null
  createdAt?: Date
}

export const productSchema = (product: ProductSchemaInput) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: product.name,
  description: product.description,
  url: product.url,
  image: product.logoUrl ?? undefined,
  applicationCategory: product.asoCategory ?? "DeveloperApplication",
  keywords: product.keywords ?? undefined,
  offers: {
    "@type": "Offer",
    price:
      product.pricing === "Free" || product.pricing === "Open Source"
        ? "0"
        : undefined,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  datePublished: product.createdAt?.toISOString(),
  publisher: {
    "@type": "Organization",
    name: "BuyMyNextLaunch",
    url: siteUrl,
  },
})

export const breadcrumbSchema = (
  crumbs: { name: string; url: string }[]
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((crumb, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: crumb.name,
    item: crumb.url,
  })),
})

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BuyMyNextLaunch",
  url: siteUrl,
  description:
    "Discover developer tools, APIs, and infrastructure products. See what developers are building.",
})

export const itemListSchema = (
  items: { name: string; url: string; description: string }[]
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    url: item.url,
    description: item.description,
  })),
})
