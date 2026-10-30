"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  Sparkles,
  Bug,
  Lightbulb,
  MessageSquare,
  Send,
  CheckCircle2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { useSession } from "@/lib/auth/client"
import { useSubmitFeedback } from "@/hooks/feedback/use-submit-feedback"
import {
  FEEDBACK_TYPES,
  FEEDBACK_TYPE_OPTIONS,
  FEEDBACK_LIMITS,
  type FeedbackType,
} from "@/constants/feedback"
import { feedbackTypeButton } from "@/utils/styles"

interface FeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const getFeedbackIcon = (type: FeedbackType) => {
  switch (type) {
    case FEEDBACK_TYPES.BUG:
      return <Bug className="size-3.5" />
    case FEEDBACK_TYPES.FEATURE:
      return <Lightbulb className="size-3.5" />
    case FEEDBACK_TYPES.OTHER:
      return <MessageSquare className="size-3.5" />
    case FEEDBACK_TYPES.IMPROVEMENT:
    default:
      return <Sparkles className="size-3.5" />
  }
}

export const FeedbackDialog = ({ open, onOpenChange }: FeedbackDialogProps) => {
  const pathname = usePathname()
  const { data: session } = useSession()
  const submitMutation = useSubmitFeedback()

  const [type, setType] = useState<FeedbackType>(FEEDBACK_TYPES.IMPROVEMENT)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (session?.user?.email && !email) {
      setEmail(session.user.email)
    }
  }, [session, email])

  const resetForm = () => {
    setType(FEEDBACK_TYPES.IMPROVEMENT)
    setTitle("")
    setMessage("")
    setEmail(session?.user?.email ?? "")
    setIsSuccess(false)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setTimeout(resetForm, 200)
    }
    onOpenChange(nextOpen)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (title.trim().length < 2) {
      toast.error(
        "Title required",
        "Please provide a brief title or summary for your feedback."
      )
      return
    }

    if (message.trim().length < FEEDBACK_LIMITS.MESSAGE_MIN) {
      toast.error(
        "Message too short",
        `Please provide at least ${FEEDBACK_LIMITS.MESSAGE_MIN} characters of details.`
      )
      return
    }

    submitMutation.mutate(
      {
        type,
        title: title.trim(),
        message: message.trim(),
        email: email.trim() || null,
        pageUrl: pathname || null,
      },
      {
        onSuccess: () => {
          setIsSuccess(true)
          toast.success(
            "Feedback received!",
            "Thank you for helping us improve LaunchNests."
          )
          setTimeout(() => {
            handleOpenChange(false)
          }, 1400)
        },
        onError: (err) => {
          toast.error("Submission failed", err.message)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-none border border-dashed border-border bg-white p-6 shadow-2xl sm:max-w-md sm:p-7">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold tracking-wider text-indigo-700 uppercase">
              Community Feedback
            </span>
          </div>
          <DialogTitle className="mt-1 font-mono text-base font-bold text-slate-950 sm:text-lg">
            Share Feedback or Report an Issue
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Tell us about a bug, an improvement idea, or what you would love to
            see next on LaunchNests.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-green-50 text-green-600 ring-1 ring-green-200">
              <CheckCircle2 className="size-6" />
            </div>
            <h4 className="mt-3 font-mono text-sm font-bold text-slate-900">
              Thank You!
            </h4>
            <p className="mt-1 text-xs text-slate-500">
              Your feedback has been logged directly with the engineering team.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            {/* Feedback Category */}
            <div className="flex flex-col gap-2">
              <Label className="font-mono text-xs font-semibold text-slate-800">
                Feedback Type
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {FEEDBACK_TYPE_OPTIONS.map((option) => {
                  const isSelected = type === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setType(option.value)}
                      className={feedbackTypeButton(isSelected)}
                    >
                      {getFeedbackIcon(option.value)}
                      <span>{option.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Subject / Title */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="feedback-title"
                  className="font-mono text-xs font-semibold text-slate-800"
                >
                  Subject / Title *
                </Label>
                <span className="font-mono text-[10px] text-slate-400">
                  {title.length}/{FEEDBACK_LIMITS.TITLE_MAX}
                </span>
              </div>
              <Input
                id="feedback-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={FEEDBACK_LIMITS.TITLE_MAX}
                placeholder={
                  type === FEEDBACK_TYPES.BUG
                    ? "e.g., Broken link on tools page, search not filtering"
                    : type === FEEDBACK_TYPES.FEATURE
                      ? "e.g., Add dark mode toggle, export analytics"
                      : "e.g., Suggestion for the navigation bar"
                }
                required
              />
            </div>

            {/* Message Details */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="feedback-message"
                  className="font-mono text-xs font-semibold text-slate-800"
                >
                  Your Thoughts or Details *
                </Label>
                <span className="font-mono text-[10px] text-slate-400">
                  {message.length}/{FEEDBACK_LIMITS.MESSAGE_MAX}
                </span>
              </div>
              <Textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={FEEDBACK_LIMITS.MESSAGE_MAX}
                placeholder={
                  type === FEEDBACK_TYPES.BUG
                    ? "What went wrong? Steps to reproduce the issue..."
                    : type === FEEDBACK_TYPES.FEATURE
                      ? "What tool, filter, or feature would you like to see?"
                      : "How can we make LaunchNests better for you?"
                }
                rows={4}
                required
                className="resize-none"
              />
            </div>

            {/* Optional Email */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="feedback-email"
                  className="font-mono text-xs font-semibold text-slate-800"
                >
                  Email (Optional)
                </Label>
                {session?.user && (
                  <span className="font-mono text-[10px] text-indigo-600">
                    Signed in
                  </span>
                )}
              </div>
              <Input
                id="feedback-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com (for follow-up replies)"
              />
            </div>

            {/* Submit & Cancel Actions */}
            <div className="mt-2 flex items-center justify-end gap-2 border-t border-dashed border-border pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="h-8 rounded-none border-border px-3 text-xs font-medium"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  submitMutation.isPending ||
                  title.trim().length < 2 ||
                  message.trim().length < FEEDBACK_LIMITS.MESSAGE_MIN
                }
                className="h-8 gap-1.5 rounded-none bg-indigo-600 px-4 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                {submitMutation.isPending ? (
                  <>
                    <Spinner className="size-3.5" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="size-3.5" />
                    <span>Send Feedback</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
