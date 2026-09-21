"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { AuthModalProvider } from "@/components/auth/auth-modal-provider"
import { Toaster } from "@/components/ui/toast"
import { CheckoutStatusDialog } from "@/components/shared/checkout-status-dialog"

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
        {children}
        <CheckoutStatusDialog />
        <Toaster />
      </AuthModalProvider>
    </QueryClientProvider>
  )
}
