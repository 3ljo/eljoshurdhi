import { motion } from 'framer-motion'
import { objections } from '../lib/siteConfig'
import { fadeUp, staggerContainer, useScrollAnimation } from '../hooks/useScrollAnimation'

export default function Objections() {
  const { ref, controls } = useScrollAnimation()

  return (
    <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls} className="grid gap-5 sm:grid-cols-3">
      {objections.map(item => (
        <motion.div
          key={item.question}
          variants={fadeUp}
          className="rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card p-6 hover:border-emerald-accent/40 transition-colors duration-300"
        >
          <h3 className="font-heading font-semibold text-gray-900 dark:text-white leading-snug">{item.question}</h3>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.answer}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
