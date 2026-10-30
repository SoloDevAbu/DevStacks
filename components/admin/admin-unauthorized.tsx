import Link from "next/link"
import { ShieldAlert, ArrowLeft } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"

export const AdminUnauthorized = () => {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center p-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-4">
        <ShieldAlert className="size-7" />
      </div>
      <h1 className="text-xl font-bold text-slate-900 mb-2">Admin Access Required</h1>
      <p className="text-sm text-slate-600 mb-6">
        You must be signed in with an authorized administrator account to access the LaunchNests review dashboard.
      </p>
      <Link href={ROUTES.HOME} className={buttonVariants({ variant: "outline" })}>
        <ArrowLeft className="mr-2 size-4" />
        Back to Home
      </Link>
    </div>
  )
}
