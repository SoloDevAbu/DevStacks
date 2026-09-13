import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { countryCodeToFlag, formatLocation } from "@/utils/country"
import { ROUTES } from "@/constants/routes"
import { cn } from "@/lib/utils"

export interface MakerProfileCardProps {
  name?: string | null
  username?: string | null
  avatarUrl?: string | null
  country?: string | null
  state?: string | null
  role?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export const MakerProfileCard = ({
  name,
  username,
  avatarUrl,
  country,
  state,
  role = "Maker",
  className,
  size = "md",
}: MakerProfileCardProps) => {
  const displayName = name || username || "Maker"
  const flag = countryCodeToFlag(country)
  const locationText = formatLocation(country, state)
  const profileUrl = username ? ROUTES.MAKER(username) : null

  const content = (
    <div
      className={cn(
        "group flex items-center gap-2.5 rounded-lg border border-dashed border-border bg-white px-3 py-2 transition-all hover:border-slate-300 hover:bg-slate-50/70",
        size === "sm" && "gap-2 px-2.5 py-1.5",
        className
      )}
    >
      <Avatar
        className={cn(
          "shrink-0 border border-border/80",
          size === "sm" ? "size-6" : size === "lg" ? "size-10" : "size-8"
        )}
      >
        {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
        <AvatarFallback className="bg-slate-900 text-[10px] font-bold text-white">
          {displayName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "truncate font-semibold text-slate-900 transition-colors group-hover:text-indigo-600",
              size === "sm" ? "text-xs" : "text-sm"
            )}
          >
            {displayName}
          </span>
          {flag && (
            <span className="text-xs select-none" title={locationText}>
              {flag}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 truncate text-[11px] text-slate-500">
          {username && <span className="text-slate-400">@{username}</span>}
          {locationText && (
            <>
              <span className="text-slate-300">•</span>
              <span className="truncate">{locationText}</span>
            </>
          )}
          {!username && !locationText && <span>{role}</span>}
        </div>
      </div>
    </div>
  )

  if (profileUrl) {
    return (
      <Link href={profileUrl} className="inline-block">
        {content}
      </Link>
    )
  }

  return content
}
