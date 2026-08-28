import { motion } from 'framer-motion'
import { whyMe } from '../lib/siteConfig'
import { fadeUp, staggerContainer, useScrollAnimation } from '../hooks/useScrollAnimation'

export default function WhyMeGrid() {
  const { ref, controls } = useScrollAnimation()

  return (
    <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {whyMe.map(reason => (
        <motion.div
          key={reason.title}
          variants={fadeUp}
          whileHover={{ y: -4 }}
          className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border hover:border-emerald-accent/40 transition-all duration-300"
        >
          <svg className="w-6 h-6 text-emerald-accent mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-2">{reason.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{reason.description}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
