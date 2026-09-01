import { motion } from 'framer-motion'
import { painPoints } from '../lib/siteConfig'
import { fadeUp, staggerContainer, useScrollAnimation } from '../hooks/useScrollAnimation'

export default function PainPoints() {
  const { ref, controls } = useScrollAnimation()

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={controls}
      className="border-t border-gray-200 dark:border-white/10 divide-y divide-gray-200 dark:divide-white/10"
    >
      {painPoints.map(point => (
        <motion.div key={point} variants={fadeUp} className="flex items-start gap-4 py-5 sm:py-6">
          <span className="flex-shrink-0 w-7 h-7 rounded-full border border-red-500/40 dark:border-red-400/30 flex items-center justify-center mt-0.5">
            <svg className="w-3.5 h-3.5 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg">{point}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
