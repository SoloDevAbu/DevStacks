import { Badge } from "@/components/ui/badge"
import { ITEM_KIND_LABELS, type ItemKind } from "@/constants/items"
import { itemTypeBadge } from "@/utils/styles"
import { cn } from "@/lib/utils"

interface ItemTypeBadgeProps {
  kind: ItemKind
  className?: string
}

export const ItemTypeBadge = ({ kind, className }: ItemTypeBadgeProps) => {
  return (
    <Badge
      variant="outline"
      className={cn(itemTypeBadge(kind), className)}
    >
      {ITEM_KIND_LABELS[kind]}
    </Badge>
  )
}
