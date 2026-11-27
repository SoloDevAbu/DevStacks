import { Badge } from "@/components/ui/badge"
import type {
  FreeToolCheckResult,
  FreeToolCheckStatus,
} from "@/types/free-tools"
import { CHECK_STATUS_LABEL } from "@/utils/free-tools"
import {
  dashedFrame,
  dashedFrameRow,
  freeToolCheckDetail,
  freeToolCheckTitle,
  freeToolStatusBadge,
} from "@/utils/styles"

export const CheckStatusBadge = ({
  status,
  label = CHECK_STATUS_LABEL[status],
}: {
  status: FreeToolCheckStatus
  label?: string
}) => (
  <Badge variant="outline" className={freeToolStatusBadge[status]}>
    {label}
  </Badge>
)

export const FreeToolCheckList = ({
  checks,
}: {
  checks: readonly FreeToolCheckResult[]
}) => (
  <ul className={dashedFrame}>
    {checks.map((check) => (
      <li key={check.id} className={dashedFrameRow}>
        <div className="flex items-center justify-between gap-3">
          <h3 className={freeToolCheckTitle}>{check.label}</h3>
          <CheckStatusBadge status={check.status} />
        </div>
        <p className={freeToolCheckDetail}>{check.detail}</p>
      </li>
    ))}
  </ul>
)
