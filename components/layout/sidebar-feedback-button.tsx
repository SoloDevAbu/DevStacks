"use client"

import { useState } from "react"
import { MessageSquarePlus, ArrowRight } from "lucide-react"
import { CornerBrackets } from "@/components/shared/corner-brackets"
import { FeedbackDialog } from "@/components/shared/feedback-dialog"
import { sidebarFeedbackCard } from "@/utils/styles"

export const SidebarFeedbackButton = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={sidebarFeedbackCard}
        aria-label="Open feedback and suggestions dialog"
      >
        <CornerBrackets />

        <div className="flex items-center gap-3">
          <div className="flex size-7.5 shrink-0 items-center justify-center rounded-none bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
            <MessageSquarePlus className="size-4" />
          </div>

          <div className="flex flex-col">
            <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              Share Feedback
            </span>
            <span className="text-[11px] text-slate-500">
              Report bugs or suggest ideas
            </span>
          </div>
        </div>

        <div className="flex size-6 items-center justify-center text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-600">
          <ArrowRight className="size-3.5" />
        </div>
      </button>

      <FeedbackDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
