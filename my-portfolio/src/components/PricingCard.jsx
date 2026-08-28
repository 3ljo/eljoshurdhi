import { motion } from 'framer-motion'
import CTAButton from './ui/CTAButton'

export default function PricingCard({ pkg, variants }) {
  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -6 }}
      className={`flex flex-col rounded-[2rem] border p-8 bg-white dark:bg-dark-card transition-all duration-300 ${
        pkg.recommended
          ? 'border-emerald-accent/40 shadow-2xl shadow-emerald-accent/10'
          : 'border-gray-200 dark:border-dark-border hover:border-emerald-accent/40 hover:shadow-lg hover:shadow-emerald-accent/5'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-accent">
            {pkg.name}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{pkg.forWho}</p>
        </div>
        {pkg.recommended && (
          <span className="flex-shrink-0 rounded-full bg-emerald-accent/10 px-3 py-2 text-[11px] font-semibold uppercase text-emerald-accent">
            Recommended
          </span>
        )}
      </div>

      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed border-l-2 border-emerald-accent/30 pl-3">
        {pkg.problem}
      </p>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-3xl font-heading font-black text-gray-900 dark:text-white">{pkg.price}</span>
        <span className="text-sm text-gray-400 dark:text-gray-500">{pkg.priceNote}</span>
      </div>
      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{pkg.timeframe}</p>

      <div className="mt-8 space-y-4 flex-1">
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
    </motion.div>
  )
}
