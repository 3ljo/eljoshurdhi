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
          className="rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark p-6"
        >
          <h3 className="font-display font-semibold text-ink dark:text-ink-dark leading-snug">{item.question}</h3>
          <p className="mt-3 text-sm text-slate dark:text-slate-dark leading-relaxed">{item.answer}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
