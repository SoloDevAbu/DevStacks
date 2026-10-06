"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  Suspense,
  useEffect,
} from "react"
import { AuthDialog } from "@/components/auth/auth-dialog"
import { useSession } from "@/lib/auth/client"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { trackLogin, trackSignUp } from "@/lib/analytics/events"

interface OpenAuthModalOptions {
  defaultTab?: "signin" | "signup"
  redirectTo?: string
  onAuthenticated?: () => void
  title?: string
  description?: string
}

interface AuthModalContextValue {
  isOpen: boolean
  openAuthModal: (options?: OpenAuthModalOptions) => void
  closeAuthModal: () => void
  requireAuth: (action: () => void, options?: OpenAuthModalOptions) => void
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null)

const AuthQueryListener = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { openAuthModal } = useAuthModal()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (isPending) return
    if (session?.user) return

    const redirectPath = searchParams.get("redirect")
    if (redirectPath) {
      window.history.replaceState({}, "", pathname)

      const isTool = redirectPath.includes("type=tool")
      const isProduct =
        redirectPath.includes("type=product") ||
        redirectPath.includes("showcase")

      openAuthModal({
        redirectTo: redirectPath,
        title: isTool
          ? "Sign in with Google to launch a developer tool"
          : isProduct
            ? "Sign in with Google to launch a product"
            : "Sign in with Google to launch",
        description: isTool
          ? "Connect with your Google account to list your developer tool, API, or infrastructure."
          : isProduct
            ? "Connect with your Google account to launch your product and declare your tech stack."
            : "Connect with your Google account to launch your product or developer tool.",
      })
    }
  }, [searchParams, isPending, session?.user, openAuthModal, pathname])

  return null
}

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<OpenAuthModalOptions>({})
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.user?.id && typeof window !== "undefined") {
      const pendingMethod = sessionStorage.getItem("pending_auth_login")
      if (pendingMethod) {
        sessionStorage.removeItem("pending_auth_login")
        const createdAt = (session.user as { createdAt?: string | Date }).createdAt
        const isNewUser =
          createdAt &&
          Date.now() - new Date(createdAt).getTime() < 120_000
        if (isNewUser) {
          trackSignUp(pendingMethod)
        } else {
          trackLogin(pendingMethod)
        }
      }
    }
  }, [session?.user?.id, session?.user])

  const openAuthModal = useCallback((opts: OpenAuthModalOptions = {}) => {
    setOptions(opts)
    setIsOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setIsOpen(false)
    setOptions({})
  }, [])

  const requireAuth = useCallback(
    (action: () => void, opts: OpenAuthModalOptions = {}) => {
      if (session?.user) {
        action()
      } else {
        openAuthModal({
          ...opts,
          onAuthenticated: () => {
            action()
            opts.onAuthenticated?.()
          },
        })
      }
    },
    [session?.user, openAuthModal]
  )

  const handleSuccess = useCallback(() => {
    if (options.onAuthenticated) {
      options.onAuthenticated()
    }
    if (options.redirectTo) {
      router.push(options.redirectTo)
      router.refresh()
    }
  }, [options, router])

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        openAuthModal,
        closeAuthModal,
        requireAuth,
      }}
    >
      {children}
      <Suspense fallback={null}>
        <AuthQueryListener />
      </Suspense>
      <AuthDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        defaultTab={options.defaultTab ?? "signin"}
        redirectTo={options.redirectTo}
        onSuccess={handleSuccess}
        title={options.title}
        description={options.description}
      />
    </AuthModalContext.Provider>
  )
}

export const useAuthModal = () => {
  const context = useContext(AuthModalContext)
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider")
  }
  return context
}
