import { motion } from 'framer-motion'
import CTAButton from './ui/CTAButton'

export default function PricingCard({ pkg, variants }) {
  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -6 }}
      className={`relative flex flex-col rounded-3xl p-8 transition-shadow duration-300 ${
        pkg.recommended
          ? 'bg-ink dark:bg-surface-dark text-ink-dark border-2 border-signal dark:border-signal-dark shadow-xl shadow-ink/10 lg:-translate-y-3'
          : 'bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark hover:border-signal/50 dark:hover:border-signal-dark/50'
      }`}
    >
      {pkg.recommended && (
        <span className="absolute -top-3 left-8 rounded-full bg-signal dark:bg-signal-dark text-signal-ink text-[11px] font-display font-semibold uppercase tracking-[0.15em] px-3 py-1">
          Most popular
        </span>
      )}

      <p
        className={`font-mono text-xs uppercase tracking-[0.2em] ${
          pkg.recommended ? 'text-signal-dark' : 'text-signal dark:text-signal-dark'
        }`}
      >
        {pkg.name}
      </p>
      <p
        className={`mt-2 text-sm ${
          pkg.recommended ? 'text-ink-dark/70' : 'text-slate dark:text-slate-dark'
        }`}
      >
        {pkg.forWho}
      </p>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="font-display text-4xl font-bold">{pkg.price}</span>
        <span className={pkg.recommended ? 'text-ink-dark/60 text-sm' : 'text-slate dark:text-slate-dark text-sm'}>
          {pkg.priceNote}
        </span>
      </div>
      <p className={`mt-1 font-mono text-xs ${pkg.recommended ? 'text-ink-dark/60' : 'text-slate dark:text-slate-dark'}`}>
        {pkg.timeframe}
      </p>

      <ul className="mt-7 space-y-3 flex-1">
        {pkg.includes.map(item => (
          <li key={item} className="flex items-start gap-3 text-sm leading-relaxed">
            <svg
              className={`w-4 h-4 mt-0.5 flex-shrink-0 ${pkg.recommended ? 'text-signal-dark' : 'text-signal dark:text-signal-dark'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className={pkg.recommended ? 'text-ink-dark/85' : 'text-ink/85 dark:text-ink-dark/85'}>{item}</span>
          </li>
        ))}
      </ul>

      <CTAButton
        to={`/contact?type=${pkg.slug}`}
        variant={pkg.recommended ? 'primary' : 'secondary'}
        className={`mt-8 w-full ${pkg.recommended ? '' : ''}`}
      >
        {pkg.slug === 'maintenance' ? 'Get a quote' : 'Start this project'}
      </CTAButton>
    </motion.div>
  )
}
