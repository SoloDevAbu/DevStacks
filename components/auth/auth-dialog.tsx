"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { signIn } from "@/lib/auth/client"
import { AlertCircle, Layers, ShieldCheck } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { SITE_CONFIG } from "@/constants/site"
import { GoogleIcon } from "@/components/shared/google-icon"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: "signin" | "signup"
  redirectTo?: string
  onSuccess?: () => void
  title?: string
  description?: string
}

export const AuthDialog = ({
  open,
  onOpenChange,
  redirectTo,
  title,
  description,
  onSuccess,
}: AuthDialogProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await signIn.social({
        provider: "google",
        callbackURL:
          redirectTo ||
          (typeof window !== "undefined" ? window.location.href : "/"),
      })
      onSuccess?.()
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to connect with Google. Please check your credentials."
      setError(message)
      setIsLoading(false)
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setError(null)
      setIsLoading(false)
    }
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-6 sm:max-w-100">
        <DialogHeader className="flex flex-col items-center gap-1.5 pb-2 text-center">
          <div className="mb-1 flex size-10 items-center justify-center rounded-md bg-slate-900 text-white shadow-sm">
            <Layers className="size-5" />
          </div>
          <DialogTitle className="text-lg font-bold">
            {title || "Sign in with Google"}
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-muted-foreground">
            {description ||
              "Continue with your Google account to showcase builds, list products, and connect with developers."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full cursor-pointer gap-2.5 border-slate-300 text-xs font-semibold shadow-xs hover:bg-slate-50"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner className="size-4 text-slate-600" />
                Connecting to Google...
              </>
            ) : (
              <>
                <GoogleIcon />
                Continue with Google
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>Fast 1-click login • No password required</span>
          </div>

          <p className="px-4 text-center text-[11px] leading-tight text-slate-400">
            By signing in, you agree to {SITE_CONFIG.name} Terms of Service and
            Privacy Policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
