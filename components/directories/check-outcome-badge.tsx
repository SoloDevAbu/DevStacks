import { Badge } from "@/components/ui/badge"
import {
  DIRECTORY_CHECK_OUTCOME_META,
  DIRECTORY_COPY,
} from "@/constants/directories"
import type { DirectoryCheck } from "@/types/directory"
import { cn } from "@/lib/utils"
import { directoryOutcomeTone } from "@/utils/styles"

export const CheckOutcomeBadge = ({
  check,
  className,
}: {
  check?: DirectoryCheck | null
  className?: string
}) => {
  const meta = check ? DIRECTORY_CHECK_OUTCOME_META[check.outcome] : null

  return (
    <Badge
      variant="outline"
      className={cn(directoryOutcomeTone[meta?.tone ?? "neutral"], className)}
    >
      {meta?.label ?? DIRECTORY_COPY.NOT_CHECKED}
    </Badge>
  )
}
