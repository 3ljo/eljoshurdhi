import { useEffect, useRef, useState } from 'react'

// Reports when an element first scrolls into view. Drawings use it to start
// plotting; content never waits on it.
export function useInView({ rootMargin = '0px 0px -10% 0px' } = {}) {
  const ref = useRef(null)
  // Without IntersectionObserver there is nothing to wait for.
  const [inView, setInView] = useState(() => !('IntersectionObserver' in window))

  useEffect(() => {
    const element = ref.current
    if (!element || inView) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold: 0.01 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [inView, rootMargin])

  return [ref, inView]
}
