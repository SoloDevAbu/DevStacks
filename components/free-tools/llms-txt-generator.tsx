"use client"

import Link from "next/link"
import { CornerBrackets } from "@/components/shared/corner-brackets"
import { FreeToolCheckList } from "@/components/shared/free-tool-check-list"
import { SiteUrlForm } from "@/components/shared/site-url-form"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { LLMS_TXT_GENERATOR } from "@/constants/free-tools"
import { PLANS, TIER } from "@/constants/plans"
import { SITE_CONFIG } from "@/constants/site"
import { useLlmsTxtCheck } from "@/hooks/free-tools/use-free-tools"
import type { LlmsTxtReport } from "@/types/free-tools"
import { downloadTextFile } from "@/utils/free-tools"
import { NOFOLLOW_LINK_REL } from "@/utils/urls"
import {
  dashedFrame,
  dashedFrameRow,
  freeToolCodeBlock,
  freeToolCtaRow,
  freeToolError,
  freeToolPanelHeader,
  freeToolReport,
  freeToolResult,
  freeToolScore,
  inlineTextLink,
  monoLabel,
  mutedText,
  proseParagraph,
} from "@/utils/styles"

const LAUNCH_PLAN = PLANS[TIER.FREE]

const ValidationSummary = ({ report }: { report: LlmsTxtReport }) => {
  const passed = report.checks.filter(({ status }) => status === "pass").length

  return (
    <div className={freeToolResult}>
      <CornerBrackets />
      <p className={mutedText}>{report.llmsTxtUrl}</p>
      <p className={freeToolScore}>
        {report.hasLlmsTxt ? `${passed}/${report.checks.length}` : "Not found"}
      </p>
      <p className="text-sm font-semibold text-slate-700">
        {report.hasLlmsTxt
          ? "llms.txt format checks passed"
          : "This site has no llms.txt yet"}
      </p>
    </div>
  )
}

const GeneratedFile = ({ report }: { report: LlmsTxtReport }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(report.generated)
      toast.success(
        "llms.txt copied",
        "Paste it into a file at your site root."
      )
    } catch {
      toast.error("Could not copy", "Select the text and copy it by hand.")
    }
  }

  const handleDownload = () =>
    downloadTextFile(
      report.generated,
      LLMS_TXT_GENERATOR.FILE_NAME,
      LLMS_TXT_GENERATOR.MIME_TYPE
    )

  return (
    <div className={dashedFrame}>
      <div className={freeToolPanelHeader}>
        <h3 className={monoLabel}>
          {report.hasLlmsTxt ? "Suggested llms.txt" : "Generated llms.txt"}
        </h3>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleDownload}>
            Download
          </Button>
          <Button type="button" onClick={handleCopy}>
            Copy
          </Button>
        </div>
      </div>
      <div className={dashedFrameRow}>
        <p className={mutedText}>
          {report.linkSource
            ? `${report.linkCount} links taken from ${report.linkSource}.`
            : "No sitemap or internal links were found, so add ## sections by hand."}{" "}
          Check the titles and descriptions, then publish it at{" "}
          {new URL(report.llmsTxtUrl).pathname} on your domain.
        </p>
        <pre className={freeToolCodeBlock}>{report.generated}</pre>
      </div>
    </div>
  )
}

const LaunchCta = () => (
  <div className={dashedFrame}>
    <div className={freeToolCtaRow}>
      <p className={proseParagraph}>
        An llms.txt tells AI tools where to look. A launch on {SITE_CONFIG.name}{" "}
        gives them a page about your product to find and cite.
      </p>
      <Button
        nativeButton={false}
        render={<Link href={LAUNCH_PLAN.ctaHref} />}
        className="shrink-0"
      >
        {LAUNCH_PLAN.ctaText} →
      </Button>
    </div>
  </div>
)

const LlmsTxtResult = ({ report }: { report: LlmsTxtReport }) => (
  <div className={freeToolReport} aria-live="polite">
    <ValidationSummary report={report} />
    <FreeToolCheckList checks={report.checks} />
    <GeneratedFile report={report} />
    <LaunchCta />
    <p className={mutedText}>
      Checked against the format at{" "}
      <a
        href={LLMS_TXT_GENERATOR.SPEC_URL}
        target="_blank"
        rel={NOFOLLOW_LINK_REL}
        className={inlineTextLink}
      >
        llmstxt.org ↗
      </a>
    </p>
  </div>
)

export const LlmsTxtGenerator = () => {
  const { mutate, data, error, isPending } = useLlmsTxtCheck()

  return (
    <div className="flex flex-col gap-4">
      <SiteUrlForm
        id="llms-txt-domain"
        label="Website domain"
        placeholder="example.com"
        submitLabel="Check site"
        isPending={isPending}
        onSubmit={mutate}
      />

      {error && (
        <p role="alert" className={freeToolError}>
          {error.message}
        </p>
      )}
      {data && <LlmsTxtResult report={data} />}
    </div>
  )
}
