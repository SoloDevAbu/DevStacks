import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export const StatusBadge = ({
  label,
  className,
}: {
  label: string
  className: string
}) => (
  <Badge variant="outline" className={cn("font-mono text-[10px] uppercase", className)}>
    {label}
  </Badge>
)
