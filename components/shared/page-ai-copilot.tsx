"use client"

import { usePathname } from "next/navigation"
import Image from "next/image"
import { Sparkles, HelpCircle, ArrowUpRight } from "lucide-react"
import { getPageAiGuide } from "@/lib/prompts"
import { AI_PROVIDERS } from "@/constants/ai-providers"
import { HoverOutline } from "@/components/shared/hover-outline"

export const PageAiCopilot = () => {
  const pathname = usePathname() || "/"
  const guide = getPageAiGuide(pathname)

  return (
    <div className="relative overflow-hidden rounded-xl border border-dashed border-indigo-200/90 bg-linear-to-b from-indigo-50/60 via-white to-slate-50/40 p-4 transition-all hover:border-indigo-300 hover:shadow-2xs">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-12 -right-12 size-36 rounded-full bg-indigo-200/30 blur-2xl" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="flex size-5 items-center justify-center rounded-md bg-indigo-600 text-white shadow-xs">
            <Sparkles className="size-3" />
          </div>
          <span className="font-mono text-[10px] font-bold tracking-wider text-indigo-700 uppercase">
            AI PAGE COPILOT
          </span>
        </div>
        <span className="rounded bg-indigo-100/70 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-indigo-800">
          Interactive
        </span>
      </div>

      {/* Page Title & Explanation */}
      <div className="relative z-10 mt-2.5">
        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
          {guide.title}
        </h4>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-600 line-clamp-3">
          {guide.whatItIs}
        </p>
      </div>

      {/* How to use snippet */}
      <div className="relative z-10 mt-2 rounded-lg border border-slate-200/60 bg-white/70 p-2 text-[10.5px] leading-relaxed text-slate-700 backdrop-blur-xs">
        <span className="font-semibold text-slate-900">How to use: </span>
        <span className="line-clamp-2">{guide.howToUse}</span>
      </div>

      {/* 1-Click AI Launcher Buttons */}
      <div className="relative z-10 mt-3">
        <p className="mb-1.5 font-mono text-[10px] font-bold tracking-wider text-slate-500 uppercase">
          ASK AI ABOUT THIS PAGE
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          {AI_PROVIDERS.map((ai) => (
            <div key={ai.id} className="group/btn relative inline-flex">
              <a
                href={`${ai.url}${encodeURIComponent(guide.prompt)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 flex items-center justify-center gap-1 rounded-md border border-slate-200/80 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 transition-all hover:bg-slate-50 hover:shadow-2xs"
                title={`Ask ${ai.name} about this page`}
              >
                <Image
                  src={ai.icon}
                  alt={ai.name}
                  width={12}
                  height={12}
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

      {/* Suggested Questions */}
      {guide.suggestedQuestions.length > 0 && (
        <div className="relative z-10 mt-3 border-t border-dashed border-indigo-100/80 pt-2.5">
          <div className="mb-1.5 flex items-center gap-1">
            <HelpCircle className="size-3 text-slate-400" />
            <span className="font-mono text-[10px] font-semibold text-slate-500 uppercase">
              Suggested Questions
            </span>
          </div>
          <div className="flex flex-col gap-1">
            {guide.suggestedQuestions.map((q, idx) => (
              <a
                key={idx}
                href={`https://chatgpt.com/?q=${encodeURIComponent(
                  `${q} (Context: LaunchNests https://launchnests.com)`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group/chip flex items-center justify-between rounded-md border border-slate-200/60 bg-white/80 px-2 py-1 text-[10.5px] text-slate-600 transition-all hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-800"
                title={`Ask: "${q}"`}
              >
                <span className="line-clamp-1">{q}</span>
                <ArrowUpRight className="size-3 shrink-0 text-slate-400 transition-transform group-hover/chip:translate-x-0.5 group-hover/chip:-translate-y-0.5 group-hover/chip:text-indigo-600" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
