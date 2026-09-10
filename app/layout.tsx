import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata } from "next"
import { HeaderLogo } from "@/components/layout/header-logo"
import { HeaderNav } from "@/components/layout/header-nav"
import { HeaderActions } from "@/components/layout/header-actions"
import { MobileNav } from "@/components/layout/mobile-nav"
import { LeftSidebar } from "@/components/shared/left-sidebar"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { AgentFooter } from "@/components/layout/agent-footer"
import { Providers } from "@/app/providers"

import { SITE_CONFIG } from "@/constants/site"
import { organizationSchema, websiteSchema } from "@/lib/seo/schema"

import "./globals.css"
import { cn } from "@/lib/utils"

import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
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
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
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
        url: `${SITE_CONFIG.url}/opengraph-image`,
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
    creator: "@devstacks",
    images: [`${SITE_CONFIG.url}/twitter-image`],
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  other: {
    "ai-agent": "DevStacks - The Developer Tools & Tech Stack Discovery Engine",
    "application-type": "developer directory",
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
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSchema) }}
        />
        <Providers>
          <div className="flex min-h-dvh flex-col bg-slate-50/30">
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
                  <HeaderLogo />
                </div>
                <div className="hidden w-full justify-center md:flex">
                  <HeaderNav />
                </div>
                <div className="shrink-0 xl:hidden">
                  <HeaderActions />
                </div>
              </div>

              {/* Top Right */}
              <div className="hidden items-center justify-end border-l border-dashed border-border px-6 xl:flex">
                <HeaderActions />
              </div>
            </header>

            {/* --- BOTTOM ROW (Content) --- */}
            <div className="grid flex-1 grid-cols-1 lg:grid-cols-[320px_1fr] xl:grid-cols-[320px_1fr_380px]">
              {/* Bottom Left (Sidebar) */}
              <aside className="sticky top-16 hidden h-[calc(100vh-64px)] flex-col overflow-y-auto border-r border-dashed border-border bg-white lg:flex">
                <LeftSidebar />
              </aside>

              {/* Bottom Center (Main) */}
              <main className="relative flex min-h-[calc(100vh-64px)] min-w-0 flex-col justify-between bg-white">
                <div className="flex-1">{children}</div>
                <AgentFooter />
              </main>

              {/* Bottom Right (Sidebar) */}
              <aside className="sticky top-16 hidden h-[calc(100vh-64px)] flex-col overflow-y-auto border-l border-dashed border-border bg-white xl:flex">
                <RightSidebar />
              </aside>
            </div>
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}

export default RootLayout
