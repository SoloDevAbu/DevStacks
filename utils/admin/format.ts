const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
})

export const formatAdminDateTime = (date: Date | string | null | undefined) =>
  date ? `${dateTimeFormat.format(new Date(date))} UTC` : "—"

export const formatCents = (cents: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100)

export const toErrorMessage = (err: unknown) =>
  err instanceof Error ? err.message : "Something went wrong."

export const humanizeFieldName = (field: string) =>
  field.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())
