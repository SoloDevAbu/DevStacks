import { ExternalLink } from "lucide-react"
import type { ComparisonSource } from "@/types/comparison"
import { formatLongDate } from "@/utils/date"
import {
  comparisonSectionSubtitle,
  comparisonSectionTitle,
} from "@/utils/styles"

interface FactSourcesProps {
  platformName: string
  factsCheckedOn: string
  sources: readonly ComparisonSource[]
}

export const FactSources = ({
  platformName,
  factsCheckedOn,
  sources,
}: FactSourcesProps) => (
  <section id="sources" className="flex flex-col gap-4">
    <div>
      <h2 className={comparisonSectionTitle}>Sources</h2>
      <p className={comparisonSectionSubtitle}>
        Every {platformName} price, rule and audience figure on this page comes
        from {platformName}&apos;s own pages, checked on{" "}
        {formatLongDate(factsCheckedOn)}. Audience numbers are their own claims;
        we have not audited them. Prices change, so check the source before you
        pay.
      </p>
    </div>
    <ul className="flex flex-col divide-y divide-dashed divide-border rounded-xl border border-dashed border-border bg-white shadow-2xs">
      {sources.map(({ label, url }) => (
        <li key={url} className="p-4">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 sm:text-sm"
          >
            {label}
            <ExternalLink className="size-3 shrink-0" />
          </a>
          <p className="mt-0.5 truncate font-mono text-[11px] text-slate-500">
            {url}
          </p>
        </li>
      ))}
    </ul>
  </section>
)
