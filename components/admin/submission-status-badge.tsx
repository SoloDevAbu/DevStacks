import { StatusBadge } from "@/components/admin/status-badge"
import { SUBMISSION_STATUS_LABEL, type SubmissionStatus } from "@/constants/moderation"
import { submissionStatusBadge } from "@/utils/styles"

export const SubmissionStatusBadge = ({ status }: { status: SubmissionStatus }) => (
  <StatusBadge label={SUBMISSION_STATUS_LABEL[status]} className={submissionStatusBadge(status)} />
)
