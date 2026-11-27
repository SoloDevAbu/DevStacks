"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"
import { REVIEW_NOTE_MAX_LENGTH, REVIEW_NOTE_MIN_LENGTH } from "@/constants/moderation"
import { toErrorMessage } from "@/utils/admin/format"
import { mutedText } from "@/utils/styles"

// Approve runs at once; reject opens a dialog that requires a reason, which is emailed to the maker.
export const ReviewActions = ({
  subject,
  onApprove,
  onReject,
  approveLabel = "Approve",
  showApprove = true,
  showReject = true,
}: {
  subject: string
  onApprove: () => Promise<unknown>
  onReject: (reviewNote: string) => Promise<unknown>
  approveLabel?: string
  showApprove?: boolean
  showReject?: boolean
}) => {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState("")
  const [busy, setBusy] = useState(false)
  const trimmed = note.trim()

  const run = async (action: () => Promise<unknown>, success: string) => {
    setBusy(true)
    try {
      await action()
      toast.success(success)
      setOpen(false)
      setNote("")
    } catch (err) {
      toast.error(toErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {showApprove && (
        <Button disabled={busy} onClick={() => run(onApprove, `${subject} approved`)}>
          {approveLabel}
        </Button>
      )}
      {showReject && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button variant="destructive" disabled={busy} />}>
            Reject
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reject {subject.toLowerCase()}</DialogTitle>
              <DialogDescription>
                The maker receives this reason by email and sees it in their dashboard.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label htmlFor="review-note">Reason</Label>
              <Textarea
                id="review-note"
                value={note}
                maxLength={REVIEW_NOTE_MAX_LENGTH}
                rows={5}
                onChange={(event) => setNote(event.target.value)}
                placeholder="What needs to change before this can be approved?"
              />
              <p className={mutedText}>
                {trimmed.length}/{REVIEW_NOTE_MAX_LENGTH}
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="destructive"
                disabled={busy || trimmed.length < REVIEW_NOTE_MIN_LENGTH}
                onClick={() => run(() => onReject(trimmed), `${subject} rejected`)}
              >
                Reject with reason
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
