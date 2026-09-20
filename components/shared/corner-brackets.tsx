import { cn } from "@/lib/utils"
import {
  cornerBracketTL,
  cornerBracketTR,
  cornerBracketBL,
  cornerBracketBR,
} from "@/utils/styles"

interface CornerBracketsProps {
  className?: string
  cornerClassName?: string
}

export const CornerBrackets = ({
  className,
  cornerClassName,
}: CornerBracketsProps = {}) => {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 z-10", className)}
      aria-hidden="true"
    >
      <div className={cn(cornerBracketTL, cornerClassName)} />
      <div className={cn(cornerBracketTR, cornerClassName)} />
      <div className={cn(cornerBracketBL, cornerClassName)} />
      <div className={cn(cornerBracketBR, cornerClassName)} />
    </div>
  )
}
