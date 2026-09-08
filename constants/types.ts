import type { LucideIcon } from "lucide-react"

export type Stat = {
  label: string
  value: string
  icon: LucideIcon | React.ComponentType<{ className?: string }>
  color: string
}
