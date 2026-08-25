import { proofStats, proofNote } from '../lib/siteConfig'

/**
 * Real, checkable proof — meant to sit next to a CTA, not live alone in an
 * "About" corner. No client quotes or invented metrics: years of experience
 * and shipped-project count only.
 */
export default function ProofStrip({ className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 ${className}`}>
      <div className="flex gap-8 sm:gap-10">
        {proofStats.map(stat => (
          <div key={stat.label}>
            <p className="font-mono text-2xl sm:text-3xl font-semibold text-ink dark:text-ink-dark">
              {stat.value}
            </p>
            <p className="text-xs sm:text-sm text-slate dark:text-slate-dark leading-snug max-w-[10rem]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate dark:text-slate-dark leading-relaxed sm:border-l sm:border-line sm:dark:border-line-dark sm:pl-6 max-w-sm">
        {proofNote}
      </p>
    </div>
  )
}
