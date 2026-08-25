import { motion } from 'framer-motion'
import { processSteps } from '../lib/siteConfig'
import { fadeUp, staggerContainer, useScrollAnimation } from '../hooks/useScrollAnimation'

export default function ProcessStrip() {
  const { ref, controls } = useScrollAnimation()

  return (
    <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-line dark:bg-line-dark rounded-2xl overflow-hidden border border-line dark:border-line-dark">
        {processSteps.map(step => (
          <motion.div key={step.step} variants={fadeUp} className="bg-surface dark:bg-surface-dark p-6">
            <span className="font-mono text-xs text-signal dark:text-signal-dark">{step.step}</span>
            <h3 className="mt-2 font-display font-semibold text-ink dark:text-ink-dark">{step.title}</h3>
            <p className="mt-2 text-sm text-slate dark:text-slate-dark leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
