import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
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
    <main className="bg-light-bg dark:bg-dark-bg">
      {/* Header */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        {/* Subtle grid pattern, matching the rest of the site */}
        <div className="absolute inset-0 opacity-5 dark:opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        <motion.div
          ref={hero.ref} variants={staggerContainer} initial="hidden" animate={hero.controls}
          className="relative max-w-3xl mx-auto px-6 text-center"
        >
          <motion.p variants={fadeUp} className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">
            Pricing
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-heading text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Packages built to launch, not just look good.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl mx-auto mb-8">
            Four ways to work together. Every package ships a live, working site — pick the one that matches
            where your business is right now.
          </motion.p>
          <motion.div variants={fadeUp} className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/" className="text-sm font-semibold text-gray-900 dark:text-white hover:text-emerald-accent transition-colors">
              Back to home
            </Link>
          </motion.div>
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
        <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
          Prices are starting points — every project gets a fixed quote in writing before work begins.
        </p>
      </section>

      {/* Process */}
      <section className="py-20 bg-gray-100 dark:bg-dark-bg">
        <div className="max-w-6xl mx-auto px-6" ref={process.ref}>
          <motion.div variants={fadeUp} initial="hidden" animate={process.controls} className="max-w-xl mb-12">
            <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="font-heading text-3xl font-bold text-gray-900 dark:text-white">Five steps, no surprises.</h2>
          </motion.div>
          <ProcessStrip />
        </div>
      </section>

      {/* Objections */}
      <section className="py-20 bg-white dark:bg-dark-bg">
        <div className="max-w-6xl mx-auto px-6" ref={faq.ref}>
          <motion.div variants={fadeUp} initial="hidden" animate={faq.controls} className="max-w-xl mb-12">
            <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">Before You Ask</p>
            <h2 className="font-heading text-3xl font-bold text-gray-900 dark:text-white">Common questions, answered upfront.</h2>
          </motion.div>
          <Objections />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gray-100 dark:bg-dark-bg">
        <div className="max-w-2xl mx-auto px-6">
          <div className="rounded-3xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card p-10 text-center">
            <h2 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-4">Not sure which package fits?</h2>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
              Tell me about the project — I'll tell you honestly which package fits, or if you need something custom.
            </p>
            <CTAButton to="/contact" size="lg">Get a quote</CTAButton>
          </div>
        </div>
      </section>
    </main>
  )
}
