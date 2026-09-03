import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ROUTES } from "@/constants/routes"

export const HeaderActions = () => {
  return (
    <div className="flex items-center gap-4">
      <Button className="rounded-none" render={<Link href={ROUTES.SUBMIT} />}>
        List a Product
      </Button>
      <Button
        variant="outline"
        className="rounded-md border-dashed border-slate-300"
      >
        Sign In
      </Button>
    </div>
  )
}
