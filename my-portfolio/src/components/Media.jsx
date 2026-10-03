import { useEffect, useRef, useState } from 'react'
import { images, largest, srcSet } from '../lib/media'
import { Icon } from './Icons'

// A responsive photo: AVIF, then WebP, then a single fallback file.
export function Picture({ name, sizes, alt, fallback, eager = false, className, imgClassName, style }) {
  const { w, h } = images[name]
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet(name, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(name, 'webp')} sizes={sizes} />
      <img
        src={fallback ?? largest(name)}
        alt={alt}
        width={w}
        height={h}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding="async"
        className={imgClassName}
        style={style}
      />
    </picture>
  )
}

const motionAllowed = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches &&
  !navigator.connection?.saveData

// A silent loop laid over its still. It only loads once it is near the
// viewport, plays while visible, and never runs for visitors who asked for
// less motion or less data. The still underneath is the poster. The pause
// control appears once the loop is actually playing and always reports what
// the video is doing, not what was last clicked.
export function LoopVideo({ name, label, className, toggleStyle }) {
  const ref = useRef(null)
  const [enabled] = useState(motionAllowed)
  const [started, setStarted] = useState(false)
  const [paused, setPaused] = useState(true)

  useEffect(() => {
    const video = ref.current
    if (!enabled || !video) return undefined
    video.muted = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.getAttribute('src')) video.setAttribute('src', `/media/video/${name}.mp4`)
          if (!video.dataset.userPaused) video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { rootMargin: '240px 0px' },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [enabled, name])

  if (!enabled) return null

  const toggle = e => {
    e.preventDefault()
    e.stopPropagation()
    const video = ref.current
    if (!video) return
    if (video.paused) {
      delete video.dataset.userPaused
      video.play().catch(() => {})
    } else {
      video.dataset.userPaused = 'true'
      video.pause()
    }
  }

  return (
    <>
      <video
        ref={ref}
        className={`${className ?? ''} ${started ? 'is-playing' : ''}`}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => {
          setStarted(true)
          setPaused(false)
        }}
        onPause={() => setPaused(true)}
      />
      {started && (
        <button
          type="button"
          className="motion-toggle"
          style={toggleStyle}
          onClick={toggle}
          aria-label={paused ? `Play ${label}` : `Pause ${label}`}
        >
          <Icon name={paused ? 'play' : 'pause'} strokeWidth={2.4} />
        </button>
      )}
    </>
  )
}
