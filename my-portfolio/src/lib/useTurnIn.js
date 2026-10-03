import { useEffect, useRef } from 'react'

// Marks an element to turn in like a page once it reaches the reader.
// Without scripts or IntersectionObserver it is simply there.
export function useTurnIn() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return undefined
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.92) return undefined
    el.dataset.turn = 'waiting'
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.turn = 'done'
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}
