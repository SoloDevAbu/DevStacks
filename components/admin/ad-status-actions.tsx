"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { useUpdateAdStatus } from "@/hooks/admin/use-admin"
import {
  ADMIN_AD_ACTION_LABEL,
  ADMIN_AD_TARGET_STATUSES,
  ADMIN_AD_TRANSITIONS,
  AD_STATUS,
  AD_STATUS_LABEL,
  type AdStatus,
} from "@/constants/ads"
import { toErrorMessage } from "@/utils/admin/format"

type AdminAdTarget = (typeof ADMIN_AD_TARGET_STATUSES)[number]

const isAdminTarget = (status: AdStatus): status is AdminAdTarget =>
  (ADMIN_AD_TARGET_STATUSES as readonly AdStatus[]).includes(status)

export const AdStatusActions = ({ id, status }: { id: string; status: AdStatus }) => {
  const update = useUpdateAdStatus()
  const targets = (ADMIN_AD_TRANSITIONS[status] ?? []).filter(isAdminTarget)
  if (targets.length === 0) return null

  const move = async (target: AdminAdTarget) => {
    try {
      await update.mutateAsync({ id, status: target })
      toast.success(`Ad is now ${AD_STATUS_LABEL[target].toLowerCase()}`)
    } catch (err) {
      toast.error(toErrorMessage(err))
    }
  }

  return (
    <div className="flex flex-wrap gap-1">
      {targets.map((target) => (
        <Button
          key={target}
          size="xs"
          variant={target === AD_STATUS.REJECTED ? "destructive" : "outline"}
          disabled={update.isPending}
          onClick={() => move(target)}
        >
          {ADMIN_AD_ACTION_LABEL[target]}
        </Button>
      ))}
    </div>
  )
}
