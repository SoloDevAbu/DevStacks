import type { ReactNode } from "react"
import { CornerBrackets } from "@/components/shared/corner-brackets"

// Corner brackets sit on a wrapper, not inside the grid, so divide-x / divide-y never style them.
export const FramedGrid = ({
  className,
  children,
}: {
  className: string
  children: ReactNode
}) => (
  <div className="relative">
    <CornerBrackets />
    <div className={className}>{children}</div>
  </div>
)
