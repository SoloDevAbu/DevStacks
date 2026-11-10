import type { ReactNode } from "react"

export interface DirectoryFact {
  label: string
  value: ReactNode
}

export const DirectoryFactList = ({
  facts,
}: {
  facts: readonly DirectoryFact[]
}) => (
  <dl className="flex flex-col divide-y divide-dashed divide-border rounded-xl border border-dashed border-border bg-white shadow-2xs">
    {facts.map(({ label, value }) => (
      <div
        key={label}
        className="grid grid-cols-1 gap-1 p-4 text-sm sm:grid-cols-[12rem_1fr] sm:gap-4"
      >
        <dt className="font-semibold text-slate-800">{label}</dt>
        <dd className="min-w-0 break-words text-slate-600">{value}</dd>
      </div>
    ))}
  </dl>
)
