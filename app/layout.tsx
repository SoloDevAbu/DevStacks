import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata, Viewport } from "next"
import { HeaderLogo } from "@/components/layout/header-logo"
import { HeaderNav } from "@/components/layout/header-nav"
import { HeaderActions } from "@/components/layout/header-actions"
import { HeaderAdvertise } from "@/components/layout/header-advertise"
import { MobileNav } from "@/components/layout/mobile-nav"
import { LeftSidebar } from "@/components/layout/left-sidebar"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { AgentFooter } from "@/components/layout/agent-footer"
import { LaunchPromoBanner } from "@/components/layout/launch-promo-banner"
import { Providers } from "@/app/providers"

import { SITE_CONFIG } from "@/constants/site"
import { organizationSchema, websiteSchema, safeJsonLd } from "@/lib/seo/schema"

import "./globals.css"
import { cn } from "@/lib/utils"

import { Analytics } from "@vercel/analytics/next"
import { GoogleAnalytics } from "@next/third-parties/google"

export const viewport: Viewport = {
  themeColor: SITE_CONFIG.themeColor,
}

const getMetadataBase = () => {
  try {
    return new URL(SITE_CONFIG.url)
  } catch {
    return new URL("http://localhost:3000")
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [...SITE_CONFIG.keywords],
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.creator,
  publisher: SITE_CONFIG.publisher,
  category: "technology",
  applicationName: SITE_CONFIG.name,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    creator: "@AbuBakkar2502",
    images: [SITE_CONFIG.ogImage],
  },
  alternates: {
    canonical: SITE_CONFIG.url,
    types: {
      "application/rss+xml": `${SITE_CONFIG.url}/feed.xml`,
    },
    languages: {
      "x-default": SITE_CONFIG.url,
      "en-US": SITE_CONFIG.url,
      en: SITE_CONFIG.url,
      "en-GB": SITE_CONFIG.url,
      "en-IN": SITE_CONFIG.url,
    },
  },
  other: {
    "ai-agent":
      "LaunchNests - Developer Tools, Product Launches & Tech Stack Discovery for AI & Search Engines",
    "application-type": "developer directory",
    "DC.Coverage": "World",
  },
}

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const orgSchema = organizationSchema()
  const webSchema = websiteSchema()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontSans.variable,
        "font-mono",
        geistMono.variable
      )}
    >
      <head>
        <link rel="me" href={SITE_CONFIG.socials.x} />
        <link rel="me" href={SITE_CONFIG.socials.linkedin} />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${SITE_CONFIG.name} — Weekly Developer Launches`}
          href={`${SITE_CONFIG.url}/feed.xml`}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(webSchema) }}
        />
        <Providers>
          <div className="flex min-h-dvh flex-col bg-slate-50/30">
            <LaunchPromoBanner />
            {/* --- TOP ROW (Navbar) --- */}
            <header className="sticky top-0 z-50 grid h-16 shrink-0 grid-cols-1 border-b border-dashed border-border bg-white lg:grid-cols-[320px_1fr] xl:grid-cols-[320px_1fr_380px]">
              {/* Top Left */}
              <div className="hidden items-center border-r border-dashed border-border px-6 lg:flex">
                <HeaderLogo />
              </div>

              {/* Top Center */}
              <div className="flex w-full items-center justify-between gap-4 px-4 lg:px-6">
                <div className="flex items-center gap-2 lg:hidden">
                  <MobileNav />
                  <HeaderLogo hideTextOnMobile />
                </div>
                <div className="hidden w-full items-center justify-between gap-4 md:flex">
                  <HeaderNav />
                  <HeaderActions />
                </div>
                <div className="shrink-0 md:hidden">
                  <HeaderActions />
                </div>
              </div>

              {/* Top Right */}
              <div className="hidden items-center justify-end border-l border-dashed border-border px-6 xl:flex">
                <HeaderAdvertise />
              </div>
            </header>

            {/* --- BOTTOM ROW (Content) --- */}
            <div className="grid flex-1 grid-cols-1 lg:grid-cols-[320px_1fr] xl:grid-cols-[320px_1fr_380px]">
              {/* Bottom Left (Sidebar) */}
              <aside className="sticky top-16 hidden h-[calc(100vh-64px)] scrollbar-thin flex-col overflow-y-auto border-r border-dashed border-border bg-white lg:flex">
                <LeftSidebar />
              </aside>

              {/* Bottom Center (Main) */}
              <main className="relative flex min-h-[calc(100vh-64px)] min-w-0 flex-col justify-between bg-white">
                <div className="flex-1">{children}</div>
                <AgentFooter />
              </main>

              {/* Bottom Right (Sidebar) */}
              <aside className="sticky top-16 hidden h-[calc(100vh-64px)] scrollbar-thin flex-col overflow-y-auto border-l border-dashed border-border bg-white xl:flex">
                <RightSidebar />
              </aside>
            </div>
          </div>
        </Providers>
        <Analytics />
        <GoogleAnalytics gaId="G-YY1Z68R6FZ" />
      </body>
    </html>
  )
}

export default RootLayout
