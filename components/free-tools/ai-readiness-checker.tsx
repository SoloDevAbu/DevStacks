"use client"

import { CornerBrackets } from "@/components/shared/corner-brackets"
import {
  CheckStatusBadge,
  FreeToolCheckList,
} from "@/components/shared/free-tool-check-list"
import { SiteUrlForm } from "@/components/shared/site-url-form"
import { cn } from "@/lib/utils"
import { useAiReadinessCheck } from "@/hooks/free-tools/use-free-tools"
import type { AiReadinessReport } from "@/types/free-tools"
import {
  dashedFrame,
  freeToolError,
  freeToolReport,
  freeToolResult,
  freeToolScore,
  monoLabel,
  mutedText,
} from "@/utils/styles"

const ReadinessReport = ({ report }: { report: AiReadinessReport }) => (
  <div className={freeToolReport} aria-live="polite">
    <div className={freeToolResult}>
      <CornerBrackets />
      <p className={mutedText}>{report.url}</p>
      <p className={freeToolScore}>{report.score}/100</p>
      <p className="text-sm font-semibold text-slate-700">AI readiness score</p>
    </div>

    <FreeToolCheckList checks={report.checks} />

    <div className={dashedFrame}>
      <h3 className={cn(monoLabel, "px-5 py-3 sm:px-6")}>
        AI crawler access to the homepage
      </h3>
      <ul className="flex flex-col divide-y divide-dashed divide-border">
        {report.crawlers.map((crawler) => (
          <li
            key={crawler.name}
            className="flex items-center justify-between gap-3 px-5 py-2.5 text-sm sm:px-6"
          >
            <span>
              <span className="font-semibold text-slate-800">
                {crawler.name}
              </span>{" "}
              <span className={mutedText}>{crawler.owner}</span>
            </span>
            <CheckStatusBadge
              status={crawler.allowed ? "pass" : "fail"}
              label={crawler.allowed ? "Allowed" : "Blocked"}
            />
          </li>
        ))}
      </ul>
    </div>
  </div>
)

export const AiReadinessChecker = () => {
  const { mutate, data, error, isPending } = useAiReadinessCheck()

  return (
    <div className="flex flex-col gap-4">
      <SiteUrlForm
        id="ai-readiness-url"
        label="Website address"
        placeholder="https://example.com"
        submitLabel="Check site"
        isPending={isPending}
        onSubmit={mutate}
      />

      {error && (
        <p role="alert" className={freeToolError}>
          {error.message}
        </p>
      )}
      {data && <ReadinessReport report={data} />}
    </div>
  )
}
