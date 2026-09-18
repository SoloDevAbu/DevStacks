import type { ComponentType, ReactNode } from "react"
import { cn } from "@/lib/utils"
import {
  DETAIL_SECTION_THEMES,
  detailSectionHeaderBase,
  detailSectionHeading,
  detailSectionSubtitle,
  type DetailSectionThemeKey,
} from "@/utils/styles"

interface DetailSectionHeaderProps {
  title: string
  subtitle?: string
  icon: ComponentType<{ className?: string }>
  theme?: DetailSectionThemeKey
  children?: ReactNode
  className?: string
}

export const DetailSectionHeader = ({
  title,
  subtitle,
  icon: Icon,
  theme = "slate",
  children,
  className,
}: DetailSectionHeaderProps) => {
  const t = DETAIL_SECTION_THEMES[theme] ?? DETAIL_SECTION_THEMES.slate

  return (
    <div className={cn(detailSectionHeaderBase, t.headerBg, className)}>
      <div className="flex flex-col gap-1">
        <h2 className={cn(detailSectionHeading, t.titleColor)}>
          <Icon className={cn("size-3.5 shrink-0", t.iconColor)} />
          {title}
        </h2>
        {subtitle && (
          <p className={cn(detailSectionSubtitle, t.subtitleColor)}>
            {subtitle}
          </p>
        )}
      </div>
      {children && <div className="self-start sm:self-auto">{children}</div>}
    </div>
  )
}
