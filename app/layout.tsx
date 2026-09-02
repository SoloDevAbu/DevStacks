import { Geist, Geist_Mono } from "next/font/google"
import { HeaderLogo } from "@/components/layout/header-logo"
import { HeaderNav } from "@/components/layout/header-nav"
import { HeaderActions } from "@/components/layout/header-actions"
import { LeftSidebar } from "@/components/home/left-sidebar"
import { RightSidebar } from "@/components/home/right-sidebar"

import "./globals.css"
import { cn } from "@/lib/utils"

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
        <div className="flex min-h-dvh flex-col bg-slate-50/30">
          {/* --- TOP ROW (Navbar) --- */}
          <header className="sticky top-0 z-50 grid h-16 shrink-0 grid-cols-1 border-b border-dashed border-border bg-white lg:grid-cols-[320px_1fr] xl:grid-cols-[320px_1fr_380px]">
            {/* Top Left */}
            <div className="hidden items-center border-r border-dashed border-border px-6 lg:flex">
              <HeaderLogo />
            </div>

            {/* Top Center */}
            <div className="flex w-full items-center justify-between gap-4 px-4 lg:px-6">
              {/* On mobile, we might need logo here */}
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
      </body>
    </html>
  )
}
