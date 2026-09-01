import { motion } from 'framer-motion'
import { whyMe } from '../lib/siteConfig'
import { fadeUp, staggerContainer, useScrollAnimation } from '../hooks/useScrollAnimation'

export default function WhyMeGrid() {
  const { ref, controls } = useScrollAnimation()

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={controls}
      className="grid sm:grid-cols-2 gap-x-12 gap-y-10"
    >
      {whyMe.map((reason, i) => (
        <motion.div key={reason.title} variants={fadeUp} className="flex gap-5">
          <span className="flex-shrink-0 font-heading text-4xl font-black text-emerald-accent/20 leading-none select-none">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className="pt-1">
            <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-2">{reason.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{reason.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
