import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollAnimation, fadeUp, staggerContainer } from '../hooks/useScrollAnimation'

const services = [
  {
    num: '01',
    title: 'Web Development',
    description: 'Full-stack web applications built with React, Node.js, and modern frameworks. Responsive, fast, and scalable.',
  },
  {
    num: '02',
    title: 'Mobile-First Design',
    description: 'Interfaces designed for every screen size. Your users get a seamless experience on any device.',
  },
  {
    num: '03',
    title: 'API & Backend',
    description: 'RESTful APIs, database design, and server-side logic that powers your application reliably.',
  },
  {
    num: '04',
    title: 'AI & Automation',
    description: 'Smart automation powered by AI — from intelligent workflows and chatbots to data pipelines that eliminate repetitive tasks.',
  },
  {
    num: '05',
    title: 'UI/UX Design',
    description: 'Clean, intuitive interfaces that prioritize user experience and visual clarity.',
  },
  {
    num: '06',
    title: 'Maintenance & Support',
    description: 'Ongoing technical support, performance optimization, and feature updates for existing projects.',
  },
]

export default function Services() {
  const [expanded, setExpanded] = useState(null)
  const { ref, controls } = useScrollAnimation()

  return (
    <section id="services" className="py-24 lg:py-32 bg-gray-100 dark:bg-dark-bg relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={controls}
        className="max-w-4xl mx-auto px-6 relative z-10"
      >
        {/* Section Header */}
        <motion.div variants={fadeUp} className="text-center mb-16">
          <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">What I Do</p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Services & Expertise<span className="text-emerald-accent">.</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            End-to-end solutions from planning to production. Here's how I can help bring your vision to life.
          </p>
        </motion.div>

        {/* Accordion List */}
        <div className="flex flex-col">
          {services.map((service) => {
            const isOpen = expanded === service.num
            return (
              <motion.div
                key={service.num}
                variants={fadeUp}
                onClick={() => setExpanded(isOpen ? null : service.num)}
                className="group border-t border-gray-200 dark:border-white/10 last:border-b cursor-pointer"
              >
                <div className="flex items-center gap-6 py-6 sm:py-8">
                  <span className="text-sm font-mono text-emerald-accent/60 group-hover:text-emerald-accent transition-colors">
                    {service.num}
                  </span>
                  <h3 className={`flex-1 text-xl sm:text-2xl font-heading font-semibold transition-colors duration-300 ${
                    isOpen ? 'text-emerald-accent' : 'text-gray-900 dark:text-white group-hover:text-emerald-accent'
                  }`}>
                    {service.title}
                  </h3>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-2xl text-gray-500 group-hover:text-emerald-accent transition-colors"
                  >
                    +
                  </motion.span>
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed pl-12 pb-8 max-w-lg">
                        {service.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
