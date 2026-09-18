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
  align?: "start" | "center" | "end"
}

export const AskAiBar = ({
  prompt,
  label = "ASK AI ABOUT THIS PAGE",
  questions = [],
  compact = false,
  className,
  align = "start",
}: AskAiBarProps) => {
  const alignClass =
    align === "end"
      ? "items-end justify-end text-right"
      : align === "center"
        ? "items-center justify-center text-center"
        : "items-start justify-start text-left"

  return (
    <div className={cn("flex flex-col gap-2.5", alignClass, className)}>
      {label && (
        <div className="flex items-center gap-1.5">
          <Sparkles className="size-3 text-indigo-600" />
          <p className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
            {label}
          </p>
        </div>
      )}

      <div
        className={cn(
          "flex flex-wrap items-center gap-2",
          align === "end"
            ? "justify-end"
            : align === "center"
              ? "justify-center"
              : "justify-start"
        )}
      >
        {AI_PROVIDERS.map((ai) => (
          <div key={ai.id} className="group/btn relative inline-flex">
            <a
              href={`${ai.url}${encodeURIComponent(prompt)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "relative z-10 flex items-center justify-center gap-1.5 rounded-md border border-slate-200/80 bg-white/95 text-slate-700 transition-all hover:bg-slate-50 hover:shadow-2xs",
                compact
                  ? "px-2 py-0.5 text-[11px]"
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

      {/* {questions.length > 0 && (
        <div
          className={cn(
            "flex flex-wrap items-center gap-1.5 pt-1",
            align === "end"
              ? "justify-end"
              : align === "center"
                ? "justify-center"
                : "justify-start"
          )}
        >
          {questions.map((q, idx) => (
            <a
              key={idx}
              href={`https://chatgpt.com/?q=${encodeURIComponent(
                `${q} (Reference: LaunchNests https://launchnests.com)`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-slate-200/70 bg-slate-50/80 px-2.5 py-0.5 text-[11px] text-slate-600 transition-all hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-700"
              title={`Ask AI: "${q}"`}
            >
              <span>{q}</span>
            </a>
          ))}
        </div>
      )} */}
    </div>
  )
}
