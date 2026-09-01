import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { caseStudies, templateStyles, primaryCta } from '../lib/siteConfig'
import { useScrollAnimation, fadeUp, staggerContainer } from '../hooks/useScrollAnimation'
import CTAButton from '../components/ui/CTAButton'
import CaseStudyTile from '../components/CaseStudyTile'
import TemplateTile from '../components/TemplateTile'

function CaseStudyModal({ project, onClose }) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!project) return null

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        onClick={e => e.stopPropagation()}
        className="relative bg-white dark:bg-dark-card w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative h-48 sm:h-56 overflow-hidden">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-t ${project.accent}`} />
          <div className="absolute bottom-5 left-5 right-5">
            <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/90 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full mb-3">
              {project.niche}
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white">{project.title}</h3>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <p className="font-heading text-lg font-semibold text-gray-900 dark:text-white leading-snug mb-6">
            {project.outcome}
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <CTAButton href={project.href} variant="primary" size="md">
              View live site
            </CTAButton>
          </div>

          <div className="flex flex-wrap gap-2 mb-7">
            {project.tags.map(tag => (
              <span key={tag} className="text-xs font-medium text-emerald-accent bg-emerald-accent/10 border border-emerald-accent/20 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-accent mb-2">The Problem</p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{project.problem}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-accent mb-2">What I Changed</p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{project.role}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-accent mb-2">Result</p>
              <p className="text-gray-900 dark:text-white font-medium leading-relaxed">{project.result}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-accent mb-2">Highlights</p>
              <ul className="space-y-2">
                {project.highlights.map(h => (
                  <li key={h} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-emerald-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function TemplateStyles() {
  const { ref, controls } = useScrollAnimation()

  return (
    <section id="templates" className="py-20 bg-gray-100 dark:bg-dark-bg scroll-mt-24">
      <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls} className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-10">
          <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">Need It Faster?</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Or start from a proven layout.
          </h2>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            These aren't from my portfolio — they're licensed templates I customize with your brand, copy, and
            content for a faster, lower-cost launch than a fully custom build. Good fit for the Launch package.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {templateStyles.map(t => (
            <motion.a
              key={t.title}
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeUp}
              className="group relative rounded-2xl overflow-hidden h-64 sm:h-72 flex flex-col justify-end"
            >
              <TemplateTile template={t} />
            </motion.a>
          ))}
        </div>

        <p className="mt-6 text-xs text-gray-400 dark:text-gray-500 max-w-2xl">
          Licensed templates, not original designs — layout, colors, and content get customized to your business.
          Mention a style by name when you reach out.
        </p>
      </motion.div>
    </section>
  )
}

export default function Work() {
  const { ref, controls } = useScrollAnimation()
  const [active, setActive] = useState(null)

  return (
    <main className="bg-light-bg dark:bg-dark-bg">
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">Work</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Case studies, not a screenshot gallery.
          </h1>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl mx-auto">
            Every project shipped to a real, working product. Click any card for the problem, what I built, and the live link.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls} className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {caseStudies.map((project, i) => (
              <motion.button
                key={project.title}
                type="button"
                onClick={() => setActive(project)}
                variants={fadeUp}
                className={`group relative rounded-2xl overflow-hidden text-left w-full ${
                  project.size === 'large' ? 'md:col-span-2 h-64 sm:h-80 lg:h-96' : 'h-64 sm:h-80'
                }`}
              >
                <CaseStudyTile project={project} index={i} />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </section>

      <TemplateStyles />

      <section className="py-20 bg-white dark:bg-dark-bg">
        <div className="max-w-2xl mx-auto px-6">
          <div className="rounded-3xl border border-gray-200 dark:border-dark-border bg-gray-100 dark:bg-dark-card p-10 text-center">
            <h2 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-4">Want a project like these?</h2>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
              Tell me what you're building — I'll tell you honestly what it takes to ship it.
            </p>
            <CTAButton to="/contact" size="lg">{primaryCta}</CTAButton>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {active && <CaseStudyModal project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </main>
  )
}
