import { HeaderLogo } from "@/components/layout/header-logo"
import { HeaderNav } from "@/components/layout/header-nav"
import { HeaderActions } from "@/components/layout/header-actions"
import { LeftSidebar } from "@/components/home/left-sidebar"
import { RightSidebar } from "@/components/home/right-sidebar"
import { MainContent } from "@/components/home/main-content"

export default function Page() {
  return (
    <div className="grid h-dvh md:grid-cols-[240px_1fr_300px] grid-rows-[64px_1fr] bg-slate-50/30">
      
      {/* --- TOP ROW (Navbar) --- */}
      {/* Top Left */}
      <div className="hidden md:flex border-b border-r border-dashed border-border items-center px-6">
        <HeaderLogo />
      </div>
      
      {/* Top Center */}
      <div className="border-b border-dashed border-border flex items-center justify-between md:justify-center px-4 md:px-6 bg-white">
        {/* On mobile, we might need logo here */}
        <div className="md:hidden"><HeaderLogo /></div>
        <div className="hidden md:flex"><HeaderNav /></div>
        <div className="md:hidden"><HeaderActions /></div>
      </div>
      
      {/* Top Right */}
      <div className="hidden md:flex border-b border-l border-dashed border-border items-center justify-end px-6">
        <HeaderActions />
      </div>

      {/* --- BOTTOM ROW (Content) --- */}
      {/* Bottom Left (Sidebar) */}
      <div className="hidden md:flex flex-col border-r border-dashed border-border overflow-y-auto bg-slate-50/50">
        <LeftSidebar />
      </div>

      {/* Bottom Center (Main) */}
      <div className="overflow-y-auto relative bg-white">
        <MainContent />
      </div>

      {/* Bottom Right (Sidebar) */}
      <div className="hidden md:flex flex-col border-l border-dashed border-border overflow-y-auto bg-white">
        <RightSidebar />
      </div>
    </div>
  )
}
