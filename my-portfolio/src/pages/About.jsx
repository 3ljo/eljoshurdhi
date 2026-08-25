import { motion } from 'framer-motion'
import { useScrollAnimation, fadeUp, slideLeft, slideRight, staggerContainer } from '../hooks/useScrollAnimation'
import CTAButton from '../components/ui/CTAButton'
import ProofStrip from '../components/ProofStrip'
import { brand } from '../lib/siteConfig'

const stack = ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Node.js', 'PostgreSQL', 'Supabase']

const fitFor = [
  'Founders and small businesses who need a site live in weeks, not a six-month agency retainer',
  'People who want direct access to the person actually building — no account manager relaying messages',
  'Projects with a clear goal: more leads, a working MVP, or a site that finally looks like the business behind it',
]

const notFitFor =
  "Large procurement processes or projects that need a full in-house team on-site — for those, an agency is the better call."

export default function About() {
  const { ref, controls } = useScrollAnimation()

  return (
    <main className="bg-bg dark:bg-bg-dark">
      <section className="pt-32 pb-24 lg:pt-40 lg:pb-28">
        <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls} className="max-w-6xl mx-auto px-6">
          <motion.div variants={fadeUp} className="max-w-2xl mb-16">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal dark:text-signal-dark mb-4">About</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink dark:text-ink-dark mb-6 text-balance">
              The person who'll actually write your code.
            </h1>
            <ProofStrip />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-14">
            <motion.div variants={slideLeft}>
              <p className="text-lg text-ink dark:text-ink-dark leading-relaxed mb-5">
                I'm {brand.name}, a frontend developer based in {brand.location}. I studied Computer Engineering
                &amp; IT at the Canadian Institute of Technology, and I've spent the last four years building
                production web software — currently as a web developer at WhiteDesk, alongside independent
                projects for founders and small businesses.
              </p>
              <p className="text-slate dark:text-slate-dark leading-relaxed mb-5">
                Day to day that's React, Next.js, and TypeScript on the frontend, with enough backend and
                database experience — Node.js, PostgreSQL, Supabase — to ship a feature end-to-end instead of
                waiting on someone else's API.
              </p>
              <p className="text-slate dark:text-slate-dark leading-relaxed mb-8">
                No agency overhead, no relay through a project manager. You describe the problem, I build the
                thing that solves it, and you can see it happening the whole way through.
              </p>

              <div className="flex flex-wrap gap-2">
                {stack.map(tech => (
                  <span key={tech} className="text-xs font-mono text-ink dark:text-ink-dark bg-surface dark:bg-surface-dark border border-line dark:border-line-dark px-3 py-1.5 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={slideRight}>
              <div className="rounded-3xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark p-8">
                <h2 className="font-display text-xl font-semibold text-ink dark:text-ink-dark mb-5">
                  Who I work best with
                </h2>
                <ul className="space-y-4 mb-6">
                  {fitFor.map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-signal dark:text-signal-dark flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate dark:text-slate-dark leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-5 border-t border-line dark:border-line-dark">
                  <p className="text-sm text-slate dark:text-slate-dark leading-relaxed">
                    <span className="font-semibold text-ink dark:text-ink-dark">Not the right fit: </span>
                    {notFitFor}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <CTAButton to="/contact" size="lg">Work with me</CTAButton>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
