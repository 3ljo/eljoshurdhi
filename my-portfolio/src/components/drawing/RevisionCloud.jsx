import { useLayoutEffect, useRef, useState } from 'react'

// Builds a revision cloud (the scalloped outline that marks a change on a
// drawing) around a box of the given size.
function cloudPath(width, height, radius = 14, inset = 2) {
  const x0 = inset
  const y0 = inset
  const x1 = width - inset
  const y1 = height - inset
  const edge = (from, to, count) =>
    Array.from({ length: count }, (_, i) => [
      from[0] + ((to[0] - from[0]) * (i + 1)) / count,
      from[1] + ((to[1] - from[1]) * (i + 1)) / count,
    ])
  const along = length => Math.max(2, Math.round(length / (radius * 1.6)))
  const points = [
    ...edge([x0, y0], [x1, y0], along(x1 - x0)),
    ...edge([x1, y0], [x1, y1], along(y1 - y0)),
    ...edge([x1, y1], [x0, y1], along(x1 - x0)),
    ...edge([x0, y1], [x0, y0], along(y1 - y0)),
  ]
  let d = `M ${x0} ${y0}`
  for (const [x, y] of points) {
    d += ` A ${radius} ${radius} 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return `${d} Z`
}

export default function RevisionCloud({ children, className = '' }) {
  const boxRef = useRef(null)
  const [size, setSize] = useState(null)

  useLayoutEffect(() => {
    const element = boxRef.current
    if (!element) return undefined
    const measure = () => setSize({ width: element.offsetWidth, height: element.offsetHeight })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      {size && (
        <svg
          className="drawing pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${size.width} ${size.height}`}
          aria-hidden="true"
        >
          <path
            d={cloudPath(size.width, size.height)}
            pathLength="1"
            className="ln"
            style={{ stroke: 'var(--action)', strokeWidth: 1.75, '--d': 200 }}
          />
        </svg>
      )}
      {children}
    </div>
  )
}
