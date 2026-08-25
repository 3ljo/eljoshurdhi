import { motion } from 'framer-motion'
import { packages } from '../lib/siteConfig'
import { useScrollAnimation, fadeUp, staggerContainer } from '../hooks/useScrollAnimation'
import CTAButton from '../components/ui/CTAButton'
import ProofStrip from '../components/ProofStrip'
import ProcessStrip from '../components/ProcessStrip'
import Objections from '../components/Objections'
import PricingCard from '../components/PricingCard'

export default function Services() {
  const hero = useScrollAnimation()
  const pricing = useScrollAnimation(0.05)
  const process = useScrollAnimation()
  const faq = useScrollAnimation()

  return (
    <main className="bg-bg dark:bg-bg-dark">
      {/* Header */}
      <section className="relative overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="absolute inset-0 grid-texture text-ink/[0.05] dark:text-ink-dark/[0.05] pointer-events-none" />
        <motion.div
          ref={hero.ref} variants={staggerContainer} initial="hidden" animate={hero.controls}
          className="relative max-w-3xl mx-auto px-6 text-center"
        >
          <motion.p variants={fadeUp} className="font-mono text-xs uppercase tracking-[0.2em] text-signal dark:text-signal-dark mb-4">
            Services &amp; Pricing
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-display text-4xl sm:text-5xl font-bold text-ink dark:text-ink-dark mb-5 text-balance">
            Packages built to launch, not just look good.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-slate dark:text-slate-dark leading-relaxed max-w-xl mx-auto mb-8">
            Four ways to work together. Every package ships a live, working site — pick the one that matches
            where your business is right now.
          </motion.p>
          <motion.div variants={fadeUp}>
            <ProofStrip className="justify-center" />
          </motion.div>
        </motion.div>
      </section>

      {/* Pricing grid */}
      <section className="pb-24">
        <motion.div
          ref={pricing.ref} variants={staggerContainer} initial="hidden" animate={pricing.controls}
          className="max-w-7xl mx-auto px-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {packages.map(pkg => (
            <PricingCard key={pkg.slug} pkg={pkg} variants={fadeUp} />
          ))}
        </motion.div>
        <p className="mt-8 text-center text-xs text-slate dark:text-slate-dark">
          Prices are starting points — every project gets a fixed quote in writing before work begins.
        </p>
      </section>

      {/* Process */}
      <section className="py-20 bg-surface dark:bg-surface-dark border-y border-line dark:border-line-dark">
        <div className="max-w-6xl mx-auto px-6" ref={process.ref}>
          <motion.div variants={fadeUp} initial="hidden" animate={process.controls} className="max-w-xl mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal dark:text-signal-dark mb-3">How it works</p>
            <h2 className="font-display text-3xl font-bold text-ink dark:text-ink-dark">Five steps, no surprises.</h2>
          </motion.div>
          <ProcessStrip />
        </div>
      </section>

      {/* Objections */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6" ref={faq.ref}>
          <motion.div variants={fadeUp} initial="hidden" animate={faq.controls} className="max-w-xl mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal dark:text-signal-dark mb-3">Before you ask</p>
            <h2 className="font-display text-3xl font-bold text-ink dark:text-ink-dark">Common questions, answered upfront.</h2>
          </motion.div>
          <Objections />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-ink dark:bg-surface-dark">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-bold text-ink-dark mb-4">Not sure which package fits?</h2>
          <p className="text-ink-dark/70 leading-relaxed mb-8">
            Tell me about the project — I'll tell you honestly which package fits, or if you need something custom.
          </p>
          <CTAButton to="/contact" size="lg">Get a quote</CTAButton>
        </div>
      </section>
    </main>
  )
}
