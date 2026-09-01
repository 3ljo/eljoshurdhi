import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { objections } from '../lib/siteConfig'
import { fadeUp, staggerContainer, useScrollAnimation } from '../hooks/useScrollAnimation'

export default function Objections() {
  const { ref, controls } = useScrollAnimation()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={controls}
      className="max-w-3xl mx-auto border-t border-gray-200 dark:border-dark-border"
    >
      {objections.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <motion.div key={item.question} variants={fadeUp} className="border-b border-gray-200 dark:border-dark-border">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 py-6 text-left"
            >
              <h3 className="font-heading font-semibold text-gray-900 dark:text-white text-base sm:text-lg">
                {item.question}
              </h3>
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full border border-gray-300 dark:border-dark-border text-gray-500 dark:text-gray-400 flex items-center justify-center transition-transform duration-300 ${
                  isOpen ? 'rotate-45 border-emerald-accent text-emerald-accent' : ''
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
