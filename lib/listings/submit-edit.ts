import { applyProductUpdate, findOwnedProduct } from "@/db/queries/products/update"
import { applyToolUpdate, findOwnedTool } from "@/db/queries/tools/update"
import {
  resubmitRejectedListing,
  upsertPendingRevision,
} from "@/db/queries/revisions"
import { SUBMISSION_STATUS } from "@/constants/moderation"
import type { LaunchItemType } from "@/constants/launches"
import type { UpdateProductInput } from "@/lib/validation/product"
import type { UpdateToolInput } from "@/lib/validation/tool"

interface EditableListing {
  id: string
  status: string
  updatedAt: Date
}

// Approved listings are public, so their edits wait for review while the live version stays up.
// Pending and rejected listings aren't public, so edits apply at once; a rejected one is
// resubmitted to the queue.
const submitEdit = async <L extends EditableListing, D extends object>({
  itemType,
  userId,
  existing,
  data,
  apply,
}: {
  itemType: LaunchItemType
  userId: string
  existing: L
  data: D
  apply: (existing: L, data: D) => Promise<L | undefined>
}) => {
  if (existing.status === SUBMISSION_STATUS.APPROVED) {
    const revision = await upsertPendingRevision({
      itemType,
      itemId: existing.id,
      submitterId: userId,
      payload: data as Record<string, unknown>,
      baseUpdatedAt: existing.updatedAt,
    })
    return { queued: true as const, item: existing, revision }
  }

  const updated = await apply(existing, data)
  if (existing.status === SUBMISSION_STATUS.REJECTED) {
    await resubmitRejectedListing({ itemType, itemId: existing.id })
  }
  return { queued: false as const, item: updated ?? existing, revision: null }
}

export const submitProductEdit = async (
  slug: string,
  userId: string,
  data: UpdateProductInput
) =>
  submitEdit({
    itemType: "product",
    userId,
    existing: await findOwnedProduct(slug, userId),
    data,
    apply: applyProductUpdate,
  })

export const submitToolEdit = async (
  slug: string,
  userId: string,
  data: UpdateToolInput
) =>
  submitEdit({
    itemType: "tool",
    userId,
    existing: await findOwnedTool(slug, userId),
    data,
    apply: applyToolUpdate,
  })
