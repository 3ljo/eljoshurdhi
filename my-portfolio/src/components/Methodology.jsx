import { motion } from 'framer-motion'
import { methodology } from '../lib/siteConfig'
import { fadeUp, staggerContainer, useScrollAnimation } from '../hooks/useScrollAnimation'

export default function Methodology() {
  const { ref, controls } = useScrollAnimation()

  return (
    <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls} className="grid md:grid-cols-5 gap-5">
      {methodology.map((item, i) => (
        <motion.div key={item.phase} variants={fadeUp} className="relative">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-accent/10 border border-emerald-accent/30 text-emerald-accent text-sm font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <h3 className="font-heading font-semibold text-gray-900 dark:text-white">{item.phase}</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.description}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
