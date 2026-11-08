"use client"

import { useState } from "react"
import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmbedBadgeDialog } from "@/components/shared/embed-badge-dialog"
import { BADGE_CHECK, BADGE_NOTICE } from "@/constants/badges"
import type { ListingKind } from "@/db/queries/badges/badge-listings"
import { badgeNotice } from "@/utils/styles"
import { isDoFollow } from "@/utils/urls"

interface BadgeStatusNoticeProps {
  name: string
  slug: string
  type: ListingKind
  websiteUrl?: string | null
  tier?: string | null
  status?: string | null
  badgeVerified?: boolean
  badgeCheckFailures?: number
}

const getNotice = ({
  tier,
  status,
  badgeVerified,
  badgeCheckFailures = 0,
}: BadgeStatusNoticeProps) => {
  if (status !== "approved") return null
  if (badgeVerified) {
    return badgeCheckFailures > 0 ? BADGE_NOTICE.AT_RISK : BADGE_NOTICE.ACTIVE
  }
  // Paid and gifted tiers are already Do-Follow, so the badge offers them nothing.
  if (isDoFollow(tier)) return null
  return badgeCheckFailures >= BADGE_CHECK.MAX_FAILURES
    ? BADGE_NOTICE.LOST
    : BADGE_NOTICE.AVAILABLE
}

export const BadgeStatusNotice = (props: BadgeStatusNoticeProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const notice = getNotice(props)

  if (!notice) return null

  return (
    <div className={badgeNotice(notice.tone)}>
      <div className="flex items-start gap-2.5">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" />
        <p className="text-xs leading-relaxed">
          <span className="font-bold">{notice.title}.</span> {notice.body}
        </p>
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => setIsDialogOpen(true)}
        className="shrink-0 bg-white text-xs font-semibold text-slate-800"
      >
        {notice.action}
      </Button>

      {isDialogOpen && (
        <EmbedBadgeDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          name={props.name}
          slug={props.slug}
          type={props.type}
          websiteUrl={props.websiteUrl}
        />
      )}
    </div>
  )
}
