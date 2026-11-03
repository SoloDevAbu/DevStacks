import { useSyncExternalStore } from "react"

const subscribe = () => () => {}

// false during SSR and hydration, true afterwards: lets client-only state (e.g. a cached session)
// render without a hydration mismatch.
export const useHasMounted = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
