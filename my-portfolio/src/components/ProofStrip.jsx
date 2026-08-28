import { proofChips } from '../lib/siteConfig'

/**
 * A continuously-scrolling trust strip — the pattern used under the hero on
 * sites like Linear, Vercel, and Stripe for compact proof/trust content
 * (there it's usually customer logos; here it's honest, checkable claims,
 * since there are no recognizable client logos to show yet).
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
              <span key={chip} className="flex items-center flex-shrink-0">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap px-4">
                  {chip}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-accent/50 flex-shrink-0" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
