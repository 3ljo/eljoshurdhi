import { motion } from 'framer-motion'
import { processSteps } from '../lib/siteConfig'
import { fadeUp, staggerContainer, useScrollAnimation } from '../hooks/useScrollAnimation'

export default function ProcessStrip() {
  const { ref, controls } = useScrollAnimation()

  return (
    <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls} className="relative">
      {/* connecting line threading through the step nodes, desktop only */}
      <div className="hidden lg:block absolute top-6 left-[10%] right-[10%] h-px bg-gray-200 dark:bg-dark-border" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-10">
        {processSteps.map(step => (
          <motion.div key={step.step} variants={fadeUp} className="relative flex flex-col items-center text-center">
            <span className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-white dark:bg-dark-bg border-2 border-emerald-accent text-emerald-accent font-heading font-bold flex items-center justify-center mb-5">
              {step.step}
            </span>
            <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
