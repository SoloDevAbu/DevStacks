import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// A GET form, so searching works without client JavaScript and keeps the other filters.
export const AdminSearchForm = ({
  action,
  defaultValue,
  hidden,
  placeholder = "Search name, tagline or slug",
}: {
  action: string
  defaultValue?: string
  hidden: Record<string, string | undefined>
  placeholder?: string
}) => (
  <form action={action} method="get" role="search" className="flex items-center gap-2">
    {Object.entries(hidden).map(([name, value]) =>
      value ? <input key={name} type="hidden" name={name} value={value} /> : null
    )}
    <Input
      name="q"
      type="search"
      defaultValue={defaultValue}
      placeholder={placeholder}
      aria-label="Search submissions"
      className="w-64"
    />
    <Button type="submit" variant="outline">
      Search
    </Button>
  </form>
)
