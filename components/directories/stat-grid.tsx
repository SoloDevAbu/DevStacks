interface DirectoryStat {
  label: string
  value: string | number
}

export const DirectoryStatGrid = ({
  stats,
}: {
  stats: readonly DirectoryStat[]
}) => (
  <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
    {stats.map(({ label, value }) => (
      <div
        key={label}
        className="rounded-xl border border-dashed border-border bg-white p-4 shadow-2xs"
      >
        <dt className="text-xs text-slate-500">{label}</dt>
        <dd className="mt-1 text-2xl font-bold text-slate-900">{value}</dd>
      </div>
    ))}
  </dl>
)
