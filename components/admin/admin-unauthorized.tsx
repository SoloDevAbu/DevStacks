"use client"

import Link from "next/link"
import { ShieldAlert, LogIn, ArrowLeft, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useAuthModal } from "@/hooks/auth/use-auth-modal"
import { signOut } from "@/lib/auth/client"
import { ROUTES } from "@/constants/routes"
import { ADMIN_PRIMARY_EMAIL } from "@/constants/admin"

export type AdminUnauthorizedProps = {
  currentEmail?: string | null
  isAuthenticated?: boolean
}

export const AdminUnauthorized = ({
  currentEmail,
  isAuthenticated = false,
}: AdminUnauthorizedProps) => {
  const { openAuthModal } = useAuthModal()

  const handleSignOutAndSwitch = async () => {
    await signOut()
    openAuthModal({
      defaultTab: "signin",
      redirectTo: ROUTES.ADMIN,
    })
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="max-w-md w-full border-border/80 shadow-md">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <ShieldAlert className="size-6" />
          </div>
          <CardTitle className="text-lg font-bold text-slate-900">
            Administrator Access Restricted
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 mt-1">
            This management console is restricted to the administrator account (
            <span className="font-mono text-slate-700 font-semibold">
              {ADMIN_PRIMARY_EMAIL}
            </span>
            ).
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 py-4 text-xs text-slate-600">
          {isAuthenticated && currentEmail ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3 flex flex-col gap-1">
              <span className="font-semibold text-amber-900">
                Currently signed in:
              </span>
              <span className="font-mono text-amber-800 text-[11px] truncate">
                {currentEmail}
              </span>
              <p className="text-[11px] text-amber-700 mt-1">
                Your current account is not authorized to moderate submissions.
                Please sign in with the Google administrator account.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-slate-600">
              Please sign in with your Google administrator account to review,
              approve, or reject submissions.
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-2">
          {isAuthenticated ? (
            <Button
              className="w-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold"
              onClick={handleSignOutAndSwitch}
            >
              <LogOut className="size-3.5 mr-2" />
              Sign Out & Switch Account
            </Button>
          ) : (
            <Button
              className="w-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold"
              onClick={() =>
                openAuthModal({
                  defaultTab: "signin",
                  redirectTo: ROUTES.ADMIN,
                })
              }
            >
              <LogIn className="size-3.5 mr-2" />
              Sign In with Google
            </Button>
          )}

          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={ROUTES.HOME} />}
            className="w-full text-xs"
          >
            <ArrowLeft className="size-3.5 mr-2" />
            Back to Directory
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
