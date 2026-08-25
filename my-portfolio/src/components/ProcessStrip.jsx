import { motion } from 'framer-motion'
import { processSteps } from '../lib/siteConfig'
import { fadeUp, staggerContainer, useScrollAnimation } from '../hooks/useScrollAnimation'

export default function ProcessStrip() {
  const { ref, controls } = useScrollAnimation()

  return (
    <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {processSteps.map(step => (
          <motion.div
            key={step.step}
            variants={fadeUp}
            className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border hover:border-emerald-accent/40 transition-colors duration-300"
          >
            <span className="text-xs font-mono text-emerald-accent/60">{step.step}</span>
            <h3 className="mt-2 font-heading font-semibold text-gray-900 dark:text-white">{step.title}</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
