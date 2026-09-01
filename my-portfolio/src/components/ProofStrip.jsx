import { proofChips } from '../lib/siteConfig'

// Hand-drawn to match every other icon on the site (stroke, viewBox 0 0 24
// 24, currentColor) rather than pulling in an icon library for six glyphs.
const ICON_PATHS = {
  sparkles: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  bolt: 'M13 10V3L4 14h7v7l9-11h-7z',
  document: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  chat: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  check: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
}

/**
 * A continuously-scrolling trust strip — the pattern used under the hero on
 * sites like Linear, Vercel, and Stripe for compact proof/trust content
 * (there it's usually customer logos; here it's short marketing statements,
 * each paired with an icon, since there are no recognizable client logos to
 * show yet and stats/numbers read as filler at this size).
 *
 * Deliberately NOT a slide-by-slide carousel: hero-area carousels are a
 * well-documented conversion killer (NN/g and others have measured ~20x
 * lower interaction versus a static hero). A one-direction marquee ticker
 * doesn't have that problem — nothing to wait for, nothing to miss, it's
 * just texture that keeps moving in the background.
 *
 * Built with a plain CSS keyframe (see .animate-marquee in index.css), not
 * a carousel library — this is a single looping strip, nothing to drag or
 * paginate. Pauses on hover so it's easy to actually read a claim.
 */
export default function ProofStrip({ className = '' }) {
  return (
    <div
      className={`group relative min-w-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] ${className}`}
    >
      <div className="flex w-max animate-marquee">
        {[0, 1].map(copy => (
          <div key={copy} className="flex items-center flex-shrink-0" aria-hidden={copy === 1}>
            {proofChips.map(chip => (
              <span key={chip.text} className="flex items-center gap-2 flex-shrink-0 px-4">
                <svg className="w-4 h-4 text-emerald-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS[chip.icon]} />
                </svg>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {chip.text}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
