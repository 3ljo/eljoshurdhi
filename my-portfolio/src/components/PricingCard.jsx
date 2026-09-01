import { motion } from 'framer-motion'
import CTAButton from './ui/CTAButton'

// Same per-tier identity as the homepage "Offer" bento — keeps the two pages
// visually consistent instead of two unrelated pricing treatments.
const tierGradients = {
  launch: 'from-sky-400 via-sky-600 to-blue-700',
  growth: 'from-emerald-400 via-emerald-600 to-teal-700',
  conversion: 'from-violet-400 via-violet-600 to-purple-700',
  care: 'from-amber-400 via-amber-500 to-orange-600',
}

export default function PricingCard({ pkg, variants }) {
  return (
    <motion.div
      variants={variants}
      className={`flex flex-col rounded-[2rem] overflow-hidden bg-white dark:bg-dark-card shadow-lg hover:shadow-2xl transition-shadow duration-300 ${
        pkg.recommended ? 'ring-2 ring-emerald-accent shadow-emerald-accent/20' : 'border border-gray-200 dark:border-dark-border'
      }`}
    >
      {/* Colored header band — the per-tier identity lives here, not on the
          whole card, so the bullet list underneath stays easy to read. */}
      <div className={`relative overflow-hidden p-6 pb-7 text-white bg-gradient-to-br ${tierGradients[pkg.slug]}`}>
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        {pkg.recommended && (
          <span className="relative inline-block text-[10px] font-semibold uppercase tracking-widest bg-white/20 px-3 py-1.5 rounded-full mb-3">
            Recommended
          </span>
        )}
        <p className="relative text-xs font-semibold uppercase tracking-[0.3em] text-white/80">{pkg.name}</p>
        <p className="relative mt-1 text-sm text-white/85 leading-relaxed">{pkg.forWho}</p>
        <div className="relative mt-5 flex items-baseline gap-2">
          <span className="text-3xl font-heading font-black">{pkg.price}</span>
          <span className="text-sm text-white/70">{pkg.priceNote}</span>
        </div>
        <p className="relative mt-1 text-xs text-white/70">{pkg.timeframe}</p>
      </div>

      <div className="flex flex-col flex-1 p-6 pt-5">
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed border-l-2 border-emerald-accent/30 pl-3 mb-6">
          {pkg.problem}
        </p>

        <div className="space-y-4 flex-1">
          {pkg.includes.map(item => (
            <div key={item} className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-accent flex-shrink-0" />
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>

        <CTAButton
          to={`/contact?type=${pkg.slug}`}
          variant={pkg.recommended ? 'primary' : 'secondary'}
          className="mt-8 w-full"
        >
          {pkg.ctaLabel}
        </CTAButton>
      </div>
    </motion.div>
  )
}
