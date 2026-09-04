import { Blocks } from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/constants/routes"

export const HeaderLogo = () => {
  return (
    <Link href={ROUTES.HOME} className="flex items-center gap-2 text-lg font-semibold">
      <div className="flex size-8 items-center justify-center rounded bg-slate-200/50 text-slate-700">
        <Blocks className="size-5" />
      </div>
      DevStacks
    </Link>
  )
}
