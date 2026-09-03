import Link from "next/link"
import { cn } from "@/lib/utils"
import { SIDEBAR_NAV } from "@/constants/navigation"
import { ROUTES } from "@/constants/routes"

export const LeftSidebar = () => {
  return (
    <div className="flex flex-col gap-8 p-8 xl:p-10">
      {SIDEBAR_NAV.map((section) => (
        <div key={section.label} className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {section.label}
          </h3>
          <nav className="mt-2 flex flex-col gap-2 text-sm font-medium text-muted-foreground">
            {section.items.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 py-1.5 hover:text-foreground",
                  item.href === ROUTES.HOME && "text-foreground"
                )}
              >
                <item.icon className="size-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      ))}
    </div>
  )
}
