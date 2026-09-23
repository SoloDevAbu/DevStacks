import Image from "next/image"
import { Sparkles } from "lucide-react"
import { AI_PROVIDERS } from "@/constants/ai-providers"
import { HoverOutline } from "@/components/shared/hover-outline"
import { cn } from "@/lib/utils"

interface AskAiBarProps {
  prompt: string
  label?: string
  questions?: string[]
  compact?: boolean
  className?: string
  align?: "start" | "center" | "end" | "responsive"
}

export const AskAiBar = ({
  prompt,
  label = "ASK AI ABOUT THIS PAGE",
  compact = false,
  className,
  align = "start",
}: AskAiBarProps) => {
  const alignClass =
    align === "responsive"
      ? "items-start justify-start text-left lg:items-end lg:justify-end lg:text-right"
      : align === "end"
        ? "items-end justify-end text-right"
        : align === "center"
          ? "items-center justify-center text-center"
          : "items-start justify-start text-left"

  const buttonsAlignClass =
    align === "responsive"
      ? "justify-start lg:justify-end"
      : align === "end"
        ? "justify-end"
        : align === "center"
          ? "justify-center"
          : "justify-start"

  return (
    <div className={cn("flex flex-col gap-2.5", alignClass, className)}>
      {label && (
        <div className="flex items-center gap-1.5">
          <Sparkles className="size-3 text-indigo-600" />
          <p className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase sm:text-[11px]">
            {label}
          </p>
        </div>
      )}

      <div className={cn("flex flex-wrap items-center gap-2", buttonsAlignClass)}>
        {AI_PROVIDERS.map((ai) => (
          <div key={ai.id} className="group/btn relative inline-flex">
            <a
              href={`${ai.url}${encodeURIComponent(prompt)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "relative z-10 flex items-center justify-center gap-1.5 rounded-md border border-slate-200/80 bg-white/95 text-slate-700 transition-all hover:bg-slate-50 hover:shadow-2xs",
                compact
                  ? "px-2 py-0.5 text-[10px] sm:text-[11px]"
                  : "px-2.5 py-1 text-xs font-medium"
              )}
              title={`Ask ${ai.name}`}
            >
              <Image
                src={ai.icon}
                alt={ai.name}
                width={compact ? 12 : 14}
                height={compact ? 12 : 14}
                className="object-contain mix-blend-multiply"
              />
              <span className="transition-colors group-hover/btn:text-slate-950">
                {ai.name}
              </span>
            </a>
            <HoverOutline />
          </div>
        ))}
      </div>
    </div>
  )
}
