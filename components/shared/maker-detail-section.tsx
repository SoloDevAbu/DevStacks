import Link from "next/link"
import { User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DetailSectionHeader } from "@/components/shared/detail-section-header"
import {
  countryCodeToFlag,
  countryCodeToName,
  formatLocation,
} from "@/utils/country"
import { ROUTES } from "@/constants/routes"
import { sectionContentBox } from "@/utils/styles"

export interface MakerDetailSectionProps {
  entityName: string
  name?: string | null
  username?: string | null
  avatarUrl?: string | null
  country?: string | null
  state?: string | null
}

const getInitials = (name?: string | null) => {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return parts[0].slice(0, 2).toUpperCase()
  }
  return "U"
}

export const MakerDetailSection = ({
  entityName,
  name,
  username,
  avatarUrl,
  country,
  state,
}: MakerDetailSectionProps) => {
  const avatarSrc = avatarUrl
  if (!name && !username && !avatarSrc) return null

  const displayName = name || username || "Developer"
  const flag = countryCodeToFlag(country)
  const countryName = countryCodeToName(country)
  const locationText = formatLocation(country, state) || countryName || country
  const profileUrl = username ? ROUTES.MAKER(username) : null

  return (
    <section className="border-b border-dashed border-border bg-white">
      <DetailSectionHeader
        title={"Built by"}
        subtitle={`The maker behind ${entityName}`}
        icon={User}
        theme="emerald"
      />

      <div className={sectionContentBox}>
        <div className="flex items-center gap-3.5">
          <Avatar className="size-12 shrink-0 border border-border shadow-2xs">
            {avatarSrc && <AvatarImage src={avatarSrc} alt={displayName} />}
            <AvatarFallback className="bg-slate-900 text-sm font-bold text-white">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-col gap-0.5">
            {profileUrl ? (
              <Link
                href={profileUrl}
                className="truncate text-sm font-bold text-slate-900 transition-colors hover:text-indigo-600"
              >
                {displayName}
              </Link>
            ) : (
              <span className="truncate text-sm font-bold text-slate-900">
                {displayName}
              </span>
            )}

            {locationText && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                {flag && <span className="text-xs select-none">{flag}</span>}
                <span className="truncate">{locationText}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
