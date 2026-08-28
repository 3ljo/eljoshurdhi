import { motion } from 'framer-motion'
import { painPoints } from '../lib/siteConfig'
import { fadeUp, staggerContainer, useScrollAnimation } from '../hooks/useScrollAnimation'

export default function PainPoints() {
  const { ref, controls } = useScrollAnimation()

  return (
    <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls} className="grid sm:grid-cols-2 gap-4">
      {painPoints.map(point => (
        <motion.div
          key={point}
          variants={fadeUp}
          className="flex items-start gap-3 rounded-xl bg-dark-card border border-white/5 p-5"
        >
          <svg className="w-5 h-5 text-red-400/80 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <p className="text-gray-300 leading-relaxed">{point}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
