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
  const onIntersectRef = useRef(onIntersect)

  useEffect(() => {
    onIntersectRef.current = onIntersect
  }, [onIntersect])

  useEffect(() => {
    if (!enabled) return

    const element = targetRef.current
    if (!element) return

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry?.isIntersecting) {
          onIntersectRef.current()
        }
      },
      { rootMargin }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [enabled, rootMargin])

  return targetRef
}
