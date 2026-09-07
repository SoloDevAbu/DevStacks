import { useEffect, useRef } from "react"

interface UseIntersectionObserverProps {
  onIntersect: () => void
  enabled?: boolean
  rootMargin?: string
}

export const useIntersectionObserver = ({
  onIntersect,
  enabled = true,
  rootMargin = "200px",
}: UseIntersectionObserverProps) => {
  const targetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled) return

    const element = targetRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry?.isIntersecting) {
          onIntersect()
        }
      },
      { rootMargin }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [onIntersect, enabled, rootMargin])

  return targetRef
}
