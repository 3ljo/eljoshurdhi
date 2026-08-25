import { motion } from 'framer-motion'
import { useScrollAnimation, fadeUp, slideLeft, slideRight, staggerContainer } from '../hooks/useScrollAnimation'
import CTAButton from '../components/ui/CTAButton'
import ProofStrip from '../components/ProofStrip'
import { brand } from '../lib/siteConfig'

const techStack = [
  { name: 'React', icon: '⚛' },
  { name: 'Next.js', icon: 'N' },
  { name: 'TypeScript', icon: 'TS' },
  { name: 'Tailwind', icon: '🌊' },
  { name: 'Node.js', icon: '▲' },
  { name: 'PostgreSQL', icon: '🐘' },
]

const fitFor = [
  'Founders and small businesses who need a site live in weeks, not a six-month agency retainer',
  'People who want direct access to the person actually building — no account manager relaying messages',
  'Projects with a clear goal: more leads, a working MVP, or a site that finally looks like the business behind it',
]

export default function About() {
  const { ref, controls } = useScrollAnimation()

  return (
    <main className="bg-white dark:bg-dark-bg">
      <section className="pt-32 pb-24 lg:pt-40 lg:pb-32">
        <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls} className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
          {/* Tech Stack Grid */}
          <motion.div variants={slideLeft} className="flex justify-center lg:sticky lg:top-28">
            <div className="grid grid-cols-3 gap-4 w-full max-w-md">
              {techStack.map(tech => (
                <motion.div
                  key={tech.name}
                  whileHover={{ y: -4, scale: 1.05 }}
                  className="group flex flex-col items-center gap-2 p-5 rounded-2xl bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-dark-border hover:border-emerald-accent/40 hover:shadow-lg hover:shadow-emerald-accent/5 transition-all duration-300"
                >
                  <span className="text-2xl leading-none">{tech.icon}</span>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-emerald-accent transition-colors">
                    {tech.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div variants={slideRight}>
            <div className="mb-8">
              <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">About</p>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                The person who'll actually<br />write your code<span className="text-emerald-accent">.</span>
              </h1>
              <div className="w-16 h-1 bg-emerald-accent rounded-full" />
            </div>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
              I'm {brand.name}, a frontend developer based in {brand.location}. I build production web
              software — React, Next.js, and TypeScript on the frontend, with enough backend and database
              experience to ship a feature end-to-end instead of waiting on someone else's API.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              No agency overhead, no relay through a project manager. You describe the problem, I build the
              thing that solves it, and you can see it happening the whole way through.
            </p>

            <ProofStrip className="mb-10" />

            <div className="rounded-3xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-card p-8 mb-8">
              <h2 className="font-heading text-xl font-semibold text-gray-900 dark:text-white mb-5">
                Who I work best with
              </h2>
              <ul className="space-y-4">
                {fitFor.map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-400 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <CTAButton to="/contact" size="lg">Work with me</CTAButton>
          </motion.div>
        </motion.div>
      </section>
    </main>
  )
}
