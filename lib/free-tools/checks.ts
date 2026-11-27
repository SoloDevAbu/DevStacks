import type {
  FreeToolCheckResult,
  FreeToolCheckStatus,
} from "@/types/free-tools"

export const createCheckBuilder =
  <Id extends string>(checks: Record<Id, { label: string }>) =>
  (
    id: Id,
    status: FreeToolCheckStatus,
    detail: string
  ): FreeToolCheckResult => ({
    id,
    label: checks[id].label,
    status,
    detail,
  })
