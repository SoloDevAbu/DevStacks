"use client"

import { useState, type FormEvent } from "react"
import { CornerBrackets } from "@/components/shared/corner-brackets"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { useAiReadinessCheck } from "@/hooks/free-tools/use-free-tools"
import type { AiReadinessReport, AiReadinessStatus } from "@/types/free-tools"
import { AI_READINESS_STATUS_LABEL } from "@/utils/free-tools"
import {
  dashedFrame,
  dashedFrameRow,
  freeToolError,
  freeToolForm,
  freeToolResult,
  freeToolScore,
  freeToolStatusBadge,
  monoLabel,
  mutedText,
} from "@/utils/styles"

const StatusBadge = ({
  status,
  label,
}: {
  status: AiReadinessStatus
  label: string
}) => (
  <Badge variant="outline" className={freeToolStatusBadge[status]}>
    {label}
  </Badge>
)

const ReadinessReport = ({ report }: { report: AiReadinessReport }) => (
  <div className="flex max-w-2xl flex-col gap-4" aria-live="polite">
    <div className={freeToolResult}>
      <CornerBrackets />
      <p className={mutedText}>{report.url}</p>
      <p className={freeToolScore}>{report.score}/100</p>
      <p className="text-sm font-semibold text-slate-700">AI readiness score</p>
    </div>

    <ul className={dashedFrame}>
      {report.checks.map((check) => (
        <li key={check.id} className={dashedFrameRow}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-slate-900">{check.label}</h3>
            <StatusBadge
              status={check.status}
              label={AI_READINESS_STATUS_LABEL[check.status]}
            />
          </div>
          <p className="text-xs break-words text-slate-600 sm:text-sm">
            {check.detail}
          </p>
        </li>
      ))}
    </ul>

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
            <StatusBadge
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
  const [url, setUrl] = useState("")
  const { mutate, data, error, isPending } = useAiReadinessCheck()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (url.trim()) mutate(url.trim())
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className={freeToolForm}>
        <Field className="flex-1">
          <FieldLabel htmlFor="ai-readiness-url" className="sr-only">
            Website address
          </FieldLabel>
          <Input
            id="ai-readiness-url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com"
            autoComplete="off"
            inputMode="url"
            required
          />
        </Field>
        <Button type="submit" disabled={isPending} className="sm:w-28">
          {isPending && <Spinner />}
          Check site
        </Button>
      </form>

      {error && (
        <p role="alert" className={freeToolError}>
          {error.message}
        </p>
      )}
      {data && <ReadinessReport report={data} />}
    </div>
  )
}
