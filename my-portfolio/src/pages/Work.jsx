import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { caseStudies } from '../lib/siteConfig'
import { useScrollAnimation, fadeUp, staggerContainer } from '../hooks/useScrollAnimation'
import CTAButton from '../components/ui/CTAButton'

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
      className="fixed inset-0 z-[100] bg-ink/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        onClick={e => e.stopPropagation()}
        className="relative bg-surface dark:bg-surface-dark w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-ink/50 hover:bg-ink/70 text-white flex items-center justify-center backdrop-blur transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative h-48 sm:h-56 overflow-hidden">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-t ${project.accent}`} />
          <div className="absolute bottom-5 left-5 right-5">
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-white/90 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full mb-3">
              {project.niche}
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">{project.title}</h3>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <p className="font-display text-lg font-semibold text-ink dark:text-ink-dark leading-snug mb-6">
            {project.outcome}
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <CTAButton href={project.href} variant="primary" size="md">
              View live site
            </CTAButton>
          </div>

          <div className="flex flex-wrap gap-2 mb-7">
            {project.tags.map(tag => (
              <span key={tag} className="text-xs font-mono text-signal dark:text-signal-dark bg-signal/10 dark:bg-signal-dark/10 border border-signal/20 dark:border-signal-dark/20 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-signal dark:text-signal-dark mb-2">The problem</p>
              <p className="text-slate dark:text-slate-dark leading-relaxed">{project.problem}</p>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-signal dark:text-signal-dark mb-2">What I built</p>
              <p className="text-slate dark:text-slate-dark leading-relaxed">{project.role}</p>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-signal dark:text-signal-dark mb-2">Highlights</p>
              <ul className="space-y-2">
                {project.highlights.map(h => (
                  <li key={h} className="flex items-start gap-3 text-slate dark:text-slate-dark">
                    <svg className="w-5 h-5 text-signal dark:text-signal-dark flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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

export default function Work() {
  const { ref, controls } = useScrollAnimation()
  const [active, setActive] = useState(null)

  return (
    <main className="bg-bg dark:bg-bg-dark">
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal dark:text-signal-dark mb-4">Work</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink dark:text-ink-dark mb-5 text-balance">
            Case studies, not a screenshot gallery.
          </h1>
          <p className="text-slate dark:text-slate-dark leading-relaxed max-w-xl mx-auto">
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
                <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className={`absolute inset-0 bg-gradient-to-t ${project.accent} opacity-90 sm:opacity-70 sm:group-hover:opacity-90 transition-opacity duration-500`} />

                <span className="absolute top-5 left-6 text-xs font-mono uppercase tracking-widest text-white/90 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full">
                  {project.niche}
                </span>
                <span className="absolute top-5 right-6 text-6xl font-display font-extrabold text-white/10 leading-none select-none pointer-events-none">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed max-w-md line-clamp-2">{project.outcome}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full">
                    Read case study
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="py-20 bg-ink dark:bg-surface-dark">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-bold text-ink-dark mb-4">Want a project like these?</h2>
          <p className="text-ink-dark/70 leading-relaxed mb-8">
            Tell me what you're building — I'll tell you honestly what it takes to ship it.
          </p>
          <CTAButton to="/contact" size="lg">Start your project</CTAButton>
        </div>
      </section>

      <AnimatePresence>
        {active && <CaseStudyModal project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </main>
  )
}
