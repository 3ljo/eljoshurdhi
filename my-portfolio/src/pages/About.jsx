import { motion } from 'framer-motion'
import { useScrollAnimation, fadeUp, staggerContainer } from '../hooks/useScrollAnimation'
import CTAButton from '../components/ui/CTAButton'
import ProofStrip from '../components/ProofStrip'
import WhyMeGrid from '../components/WhyMeGrid'
import { primaryCta } from '../lib/siteConfig'

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
    <main className="bg-white dark:bg-dark-bg">
      <section className="pt-32 pb-24 lg:pt-40 lg:pb-32">
        <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls} className="max-w-5xl mx-auto px-6">
          <motion.div variants={fadeUp} className="max-w-2xl mb-6">
            <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">Why Me</p>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-5">
              No agency bloat. No templates. No excuses.
            </h1>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              You're not hiring "a developer." You're hiring the person who builds it, talks to you directly,
              and has a single goal for your site: get you more customers.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="mb-16">
            <ProofStrip />
          </motion.div>

          <motion.div variants={fadeUp} className="mb-16">
            <WhyMeGrid />
          </motion.div>

          <motion.div variants={fadeUp} className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="rounded-3xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-card p-8">
              <h2 className="font-heading text-xl font-semibold text-gray-900 dark:text-white mb-5">
                Who I work best with
              </h2>
              <ul className="space-y-4 mb-6">
                {fitFor.map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-400 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-5 border-t border-gray-200 dark:border-dark-border">
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  <span className="font-semibold text-gray-900 dark:text-white">Not the right fit: </span>
                  {notFitFor}
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-gray-900 dark:bg-black p-8 flex flex-col justify-between h-full">
              <div>
                <h2 className="font-heading text-xl font-semibold text-white mb-3">
                  Ready to stop losing customers to a bad website?
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Tell me about your business — I'll tell you honestly what it needs.
                </p>
              </div>
              <CTAButton to="/contact" size="lg">{primaryCta}</CTAButton>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  )
}
