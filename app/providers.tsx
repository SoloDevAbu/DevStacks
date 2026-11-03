"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { AuthModalProvider } from "@/components/auth/auth-modal-provider"
import { SearchCommandProvider } from "@/components/shared/global-search-command"
import { Toaster } from "@/components/ui/toast"
import dynamic from "next/dynamic"

// Only relevant after a payment redirect, so it is not part of the initial bundle.
const CheckoutStatusDialog = dynamic(
  () =>
    import("@/components/shared/checkout-status-dialog").then(
      (mod) => mod.CheckoutStatusDialog
    ),
  { ssr: false }
)

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthModalProvider>
        <SearchCommandProvider>
          {children}
          <CheckoutStatusDialog />
          <Toaster />
        </SearchCommandProvider>
      </AuthModalProvider>
    </QueryClientProvider>
  )
}
