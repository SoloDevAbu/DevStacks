import { AlertCircle, Calendar } from "lucide-react"
import { previewBanner } from "@/utils/blog/styles"

export const BlogPreviewBanner = ({ launchDate }: { launchDate?: Date | null }) => {
  const formattedDate = launchDate
    ? new Date(launchDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "its official launch date"

  return (
    <div className={previewBanner}>
      <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
        <Calendar className="size-4 shrink-0 text-amber-600" />
        <span>
          <strong>Private Preview Mode:</strong> This launch spotlight is scheduled and will become publicly visible to visitors on <strong>{formattedDate}</strong>.
        </span>
      </div>
      <span className="hidden sm:inline-block rounded-md bg-amber-200/70 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-800">
        Scheduled
      </span>
    </div>
  )
}

