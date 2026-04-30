import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollAnimation, fadeUp, staggerContainer } from '../hooks/useScrollAnimation'

// TODO: As repos are made public, fill the `github` field for each project.
const projects = [
  {
    title: 'CV Climber',
    niche: 'Career SaaS',
    description: 'AI-powered resume builder that helps job seekers craft standout CVs and climb the career ladder faster.',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1600&h=900&fit=crop',
    tags: ['Next.js', 'AI', 'Tailwind', 'Stripe'],
    size: 'large',
    href: 'https://www.cvclimber.lol/',
    github: null,
    accent: 'from-emerald-500/30 via-emerald-900/40 to-black/90',
    problem: 'Job seekers struggle to translate their experience into a CV that ranks well on ATS systems and stands out to recruiters.',
    role: 'Designed the product end-to-end, built the AI resume generator, payment flow, and templated PDF export.',
    highlights: [
      'AI-assisted bullet rewriting tuned for ATS keywords',
      'Multiple modern templates with one-click PDF export',
      'Stripe checkout for premium plans',
    ],
  },
  {
    title: 'AI Receptionist',
    niche: 'AI Automation',
    description: 'Voice AI that answers calls, books appointments, and handles customer queries 24/7 for service businesses.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=900&fit=crop',
    tags: ['Next.js', 'OpenAI', 'Twilio', 'Supabase'],
    size: 'small',
    href: 'https://ai-recepsionist-codo.vercel.app/dashboard',
    github: null,
    accent: 'from-violet-500/30 via-indigo-900/40 to-black/90',
    problem: 'Small businesses lose leads when calls go unanswered outside hours or while staff are busy with clients.',
    role: 'Built the dashboard, the Twilio voice integration, and the OpenAI prompt layer that handles real-time conversations.',
    highlights: [
      'Real-time voice conversations powered by OpenAI',
      'Call logs, transcripts, and lead capture in one dashboard',
      'Configurable per business — hours, services, knowledge base',
    ],
  },
  {
    title: 'Nderto',
    niche: 'Construction SaaS',
    description: 'A management platform for construction crews — projects, materials, and team coordination in one dashboard.',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=900&fit=crop',
    tags: ['Next.js', 'Auth', 'Postgres', 'Tailwind'],
    size: 'small',
    href: 'https://nderto.vercel.app/login',
    github: null,
    accent: 'from-amber-500/30 via-orange-900/40 to-black/90',
    problem: 'Construction teams juggle projects, materials, and crew assignments across spreadsheets and chat apps.',
    role: 'Designed the data model, built the auth and project workflows, and shipped a clean dashboard UI.',
    highlights: [
      'Authenticated multi-role access (admin / crew)',
      'Projects, tasks, and material tracking in one place',
      'Postgres-backed schema with proper relations',
    ],
  },
  {
    title: 'ESHB',
    niche: 'Brand & Agency',
    description: 'A modern agency landing site with bold typography, smooth scroll animations, and a clear conversion path.',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&h=900&fit=crop',
    tags: ['React', 'Framer Motion', 'Tailwind'],
    size: 'small',
    href: 'https://eshb.vercel.app/',
    github: null,
    accent: 'from-rose-500/30 via-pink-900/40 to-black/90',
    problem: 'A new agency needed a landing page that communicates premium positioning and converts visitors into leads.',
    role: 'Designed and built the entire site — typography system, scroll-triggered animations, and contact flow.',
    highlights: [
      'Custom typography and color system',
      'Scroll-triggered animations with Framer Motion',
      'Mobile-first responsive layout',
    ],
  },
  {
    title: 'Eljo Shurdhi',
    niche: 'Personal Brand',
    description: 'Personal portfolio showcasing services, selected work, and a way for clients to get in touch.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=900&fit=crop',
    tags: ['React', 'Vite', 'Tailwind', 'Framer Motion'],
    size: 'small',
    href: 'https://eljoshurdhi.vercel.app/',
    github: null,
    accent: 'from-sky-500/30 via-cyan-900/40 to-black/90',
    problem: 'Needed a portfolio site that presents my work clearly and gives recruiters everything they need at a glance.',
    role: 'Designed the layout, built it from scratch with React + Vite, and tuned every interaction.',
    highlights: [
      'Dark / light theme with smooth transitions',
      'Bento-grid project showcase with case studies',
      'Optimized for fast first paint and accessibility',
    ],
  },
  {
    title: 'Sage Commerce',
    niche: 'E-commerce',
    description: 'A modern online store with product browsing, cart, and a smooth checkout flow built for conversion.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=900&fit=crop',
    tags: ['Next.js', 'Tailwind', 'Stripe', 'React'],
    size: 'large',
    href: 'https://ecomerce-sage-eight.vercel.app/',
    github: null,
    accent: 'from-teal-500/30 via-emerald-900/40 to-black/90',
    problem: 'Small brands need a fast, clean storefront that handles product discovery and checkout without the bloat of off-the-shelf platforms.',
    role: 'Designed and built the storefront end-to-end — product catalog, cart logic, and a frictionless checkout experience.',
    highlights: [
      'Responsive product grid with category filtering',
      'Persistent cart with quantity and total updates',
      'Clean, conversion-focused checkout flow',
    ],
  },
]

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white dark:bg-dark-card w-full sm:max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl"
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Cover image */}
        <div className="relative h-48 sm:h-64 overflow-hidden">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-t ${project.accent}`} />
          <div className="absolute bottom-5 left-5 right-5">
            <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/90 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full mb-3">
              {project.niche}
            </span>
            <h3 className="text-2xl sm:text-4xl font-heading font-bold text-white">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8">
          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mb-7">
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-accent hover:bg-emerald-dark text-white text-sm font-semibold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Live Demo
            </a>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 dark:border-dark-border text-gray-900 dark:text-white text-sm font-semibold hover:border-emerald-accent hover:text-emerald-accent transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                Source Code
              </a>
            )}
          </div>

          {/* Stack */}
          <div className="flex flex-wrap gap-2 mb-7">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="text-xs font-medium text-emerald-accent bg-emerald-accent/10 border border-emerald-accent/20 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Sections */}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-accent mb-2">The Problem</p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{project.problem}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-accent mb-2">My Role</p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{project.role}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-accent mb-2">Highlights</p>
              <ul className="space-y-2">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
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

export default function Portfolio() {
  const { ref, controls } = useScrollAnimation()
  const [active, setActive] = useState(null)

  return (
    <section id="portfolio" className="py-24 lg:py-32 bg-white dark:bg-dark-bg">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={controls}
        className="max-w-7xl mx-auto px-6"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="text-center mb-14">
          <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">Portfolio</p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Selected Work<span className="text-emerald-accent">.</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Click any project to read the case study, see the stack, and visit the live site.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((project, i) => (
            <motion.button
              key={project.title}
              type="button"
              onClick={() => setActive(project)}
              variants={fadeUp}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer block text-left w-full ${
                project.size === 'large' ? 'md:col-span-2 h-56 sm:h-80 lg:h-96' : 'h-48 sm:h-72'
              }`}
            >
              {/* Image */}
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Niche-tinted overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${project.accent} opacity-100 sm:opacity-70 sm:group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Niche badge */}
              <span className="absolute top-5 left-6 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/90 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full">
                {project.niche}
              </span>

              {/* Number */}
              <span className="absolute top-5 right-6 text-7xl font-heading font-extrabold text-white/10 leading-none select-none pointer-events-none">
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Case study indicator on hover */}
              <span className="absolute bottom-5 right-5 hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                Read case study
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>

              {/* Content — slides up on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 sm:pr-32 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex flex-wrap gap-2 mb-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {project.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs font-medium text-emerald-accent bg-emerald-accent/15 backdrop-blur-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 delay-75">
                  {project.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  )
}
