import { Geist, Geist_Mono } from "next/font/google"
import { HeaderLogo } from "@/components/layout/header-logo"
import { HeaderNav } from "@/components/layout/header-nav"
import { HeaderActions } from "@/components/layout/header-actions"
import { LeftSidebar } from "@/components/home/left-sidebar"
import { RightSidebar } from "@/components/home/right-sidebar"

import "./globals.css"
import { cn } from "@/lib/utils";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({subsets:['latin'],variable:'--font-mono'})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontSans.variable, "font-mono", geistMono.variable)}
    >
      <body>
        <div className="flex flex-col min-h-dvh bg-slate-50/30">
          
          {/* --- TOP ROW (Navbar) --- */}
          <header className="sticky top-0 z-50 grid h-16 shrink-0 grid-cols-1 lg:grid-cols-[320px_1fr] xl:grid-cols-[320px_1fr_380px] bg-white border-b border-dashed border-border">
            {/* Top Left */}
            <div className="hidden lg:flex border-r border-dashed border-border items-center px-6">
              <HeaderLogo />
            </div>
            
            {/* Top Center */}
            <div className="flex items-center justify-between px-4 lg:px-6 w-full gap-4">
              {/* On mobile, we might need logo here */}
              <div className="lg:hidden shrink-0"><HeaderLogo /></div>
              <div className="hidden md:flex w-full justify-center"><HeaderNav /></div>
              <div className="xl:hidden shrink-0"><HeaderActions /></div>
            </div>
            
            {/* Top Right */}
            <div className="hidden xl:flex border-l border-dashed border-border items-center justify-end px-6">
              <HeaderActions />
            </div>
          </header>

          {/* --- BOTTOM ROW (Content) --- */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-[320px_1fr] xl:grid-cols-[320px_1fr_380px]">
            {/* Bottom Left (Sidebar) */}
            <aside className="hidden lg:flex flex-col border-r border-dashed border-border bg-slate-50/50 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
              <LeftSidebar />
            </aside>

            {/* Bottom Center (Main) */}
            <main className="relative bg-white min-h-[calc(100vh-64px)]">
              {children}
            </main>

            {/* Bottom Right (Sidebar) */}
            <aside className="hidden xl:flex flex-col border-l border-dashed border-border bg-white sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
              <RightSidebar />
            </aside>
          </div>
        </div>
      </body>
    </html>
  )
}

