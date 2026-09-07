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

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: "signin" | "signup"
  redirectTo?: string
  onSuccess?: () => void
  title?: string
  description?: string
}

const GoogleIcon = () => (
  <svg className="size-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
    />
  </svg>
)

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
      <DialogContent className="sm:max-w-[400px] p-6">
        <DialogHeader className="flex flex-col items-center text-center gap-1.5 pb-2">
          <div className="flex size-10 items-center justify-center rounded-md bg-slate-900 text-white shadow-sm mb-1">
            <Layers className="size-5" />
          </div>
          <DialogTitle className="text-lg font-bold">
            {title || "Sign in with Google"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground text-center">
            {description ||
              "Continue with your Google account to showcase builds, list products, and connect with developers."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full h-11 text-xs font-semibold gap-2.5 border-slate-300 hover:bg-slate-50 cursor-pointer shadow-xs"
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

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>Fast 1-click login • No password required</span>
          </div>

          <p className="text-[11px] text-center text-slate-400 px-4 leading-tight">
            By signing in, you agree to DevStacks Terms of Service and Privacy Policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
