import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata } from "next"
import { HeaderLogo } from "@/components/layout/header-logo"
import { HeaderNav } from "@/components/layout/header-nav"
import { HeaderActions } from "@/components/layout/header-actions"
import { LeftSidebar } from "@/components/home/left-sidebar"
import { RightSidebar } from "@/components/home/right-sidebar"
import { Providers } from "@/app/providers"

import { SITE_CONFIG } from "@/constants/site"
import { organizationSchema, websiteSchema } from "@/lib/seo/schema"

import "./globals.css"
import { cn } from "@/lib/utils"

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
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    creator: "@devstacks",
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
}

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
                <div className="shrink-0 lg:hidden">
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
              <main className="relative min-w-0 min-h-[calc(100vh-64px)] bg-white">
                {children}
              </main>

              {/* Bottom Right (Sidebar) */}
              <aside className="sticky top-16 hidden h-[calc(100vh-64px)] flex-col overflow-y-auto border-l border-dashed border-border bg-white xl:flex">
                <RightSidebar />
              </aside>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
