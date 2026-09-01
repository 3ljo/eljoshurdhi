import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { packages, caseStudies, templateStyles, brand, primaryCta } from '../lib/siteConfig'
import { useScrollAnimation, fadeUp, staggerContainer } from '../hooks/useScrollAnimation'
import CTAButton from '../components/ui/CTAButton'
import ProofStrip from '../components/ProofStrip'
import PainPoints from '../components/PainPoints'
import Methodology from '../components/Methodology'
import WhyMeGrid from '../components/WhyMeGrid'
import ProcessStrip from '../components/ProcessStrip'
import Objections from '../components/Objections'
import CaseStudyTile from '../components/CaseStudyTile'
import TemplateTile from '../components/TemplateTile'

const heroImgLight = '/Confident young man in black T-shirt.png'
const heroImgDark = '/Confident portrait with casual style.png'

function Hero() {
  return (
    <section className="relative overflow-hidden bg-light-bg dark:bg-dark-bg pt-32 pb-20 lg:pt-40 lg:pb-28">
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 rounded-full bg-emerald-accent/10 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-emerald-accent/5 blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
        <motion.div className="min-w-0" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}>
          <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-4">
            For business owners, not developers
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-gray-900 dark:text-white leading-[1.08] mb-6">
            Stop losing customers to businesses with better websites.
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mb-9 leading-relaxed">
            If your site looks outdated, loads slow, or doesn't make your offer obvious in five seconds,
            you're handing customers to whoever looks better on Google. I build fast, modern websites that
            make your business look as good as it actually is — and turn visitors into inquiries.
          </p>
          <div className="flex flex-wrap gap-4 mb-6">
            <CTAButton to="/contact" size="lg">{primaryCta}</CTAButton>
            <CTAButton to="/work" variant="secondary" size="lg">See The Work</CTAButton>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-10">
            No obligation. Tell me about your business, I'll tell you honestly if I can help.
          </p>
          <ProofStrip />
        </motion.div>

        <div className="relative justify-self-center">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-accent/20 to-transparent rounded-2xl blur-3xl scale-110" />
          <picture>
            <source srcSet={heroImgDark} media="(prefers-color-scheme: dark)" />
            <img
              src={heroImgLight}
              alt={`${brand.name}, ${brand.role.toLowerCase()}`}
              className="relative w-64 sm:w-80 lg:w-[26rem] object-cover rounded-2xl drop-shadow-2xl"
            />
          </picture>
        </div>
      </div>
    </section>
  )
}

function Pain() {
  const { ref, controls } = useScrollAnimation()

  return (
    <section className="relative overflow-hidden py-24 bg-gray-50 dark:bg-dark-bg">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-rose-400/10 dark:bg-rose-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-emerald-accent/5 blur-3xl pointer-events-none" />

      <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls} className="relative max-w-5xl mx-auto px-6">
        <motion.div variants={fadeUp} className="max-w-2xl mb-12">
          <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">The Problem</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your website might be losing you customers right now.
          </h2>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            Any of this sound familiar?
          </p>
        </motion.div>

        <PainPoints />

        <motion.p variants={fadeUp} className="mt-10 text-lg text-gray-900 dark:text-white font-medium max-w-2xl">
          That's not a marketing problem. That's a website problem — and it's fixable.
        </motion.p>
      </motion.div>
    </section>
  )
}

function Solution() {
  const { ref, controls } = useScrollAnimation()
  const previews = caseStudies.slice(0, 3)
  const tilt = ['-rotate-6 top-0 left-2 z-30', 'rotate-3 top-16 right-0 z-20', 'rotate-[10deg] bottom-0 left-20 z-10']

  return (
    <section className="py-24 bg-white dark:bg-dark-bg overflow-hidden">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center mb-16">
          <motion.div variants={fadeUp} initial="hidden" animate={controls}>
            <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">The Fix</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              A website built like a sales tool, not a brochure.
            </h2>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              Not React, not Next.js, not framework talk — a business transformation with five parts, each one
              earning its place.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={controls}
            className="relative hidden lg:block h-[280px]"
          >
            {previews.map((p, i) => (
              <div
                key={p.title}
                className={`absolute w-52 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-dark-card bg-white dark:bg-dark-card ${tilt[i]}`}
              >
                <img src={p.image} alt={p.title} className="w-full h-32 object-cover" />
                <div className="p-3">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">{p.title}</p>
                  <p className="text-[10px] text-emerald-accent font-medium">{p.niche}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <Methodology />
      </div>
    </section>
  )
}

const tierGradients = {
  launch: 'from-sky-400 via-sky-600 to-blue-700 shadow-sky-600/20',
  growth: 'from-emerald-400 via-emerald-600 to-teal-700 shadow-emerald-600/20',
  conversion: 'from-violet-400 via-violet-600 to-purple-700 shadow-violet-600/20',
  care: 'from-amber-400 via-amber-500 to-orange-600 shadow-amber-500/20',
}

function Offer() {
  const { ref, controls } = useScrollAnimation()

  return (
    <section className="py-24 bg-gray-100 dark:bg-dark-bg">
      <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls} className="max-w-7xl mx-auto px-6">
        <motion.div variants={fadeUp} className="max-w-2xl mb-14">
          <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">The Offer</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Pick the package that matches where your business is.
          </h2>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            Four ways to work together — every one ships a live site built to convert, not just look good.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 items-stretch">
          {packages.map(pkg => (
            <motion.div
              key={pkg.slug}
              variants={fadeUp}
              className={`relative overflow-hidden rounded-3xl p-6 flex flex-col justify-between text-white bg-gradient-to-br shadow-xl ${tierGradients[pkg.slug]} ${
                pkg.recommended ? 'lg:col-span-2' : ''
              }`}
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="relative">
                {pkg.recommended && (
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-widest bg-white/20 px-3 py-1.5 rounded-full mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="font-heading text-xl font-bold mb-1.5">{pkg.name}</h3>
                <p className="text-white/85 text-sm leading-relaxed line-clamp-2">{pkg.forWho}</p>
              </div>
              <div className="relative mt-6">
                <p className="text-2xl font-heading font-black">
                  {pkg.price} <span className="text-xs font-sans font-normal text-white/70">{pkg.priceNote}</span>
                </p>
                <CTAButton
                  to={`/contact?type=${pkg.slug}`}
                  size="md"
                  className="w-full mt-4 !bg-white !text-gray-900 hover:!bg-white/90"
                >
                  {pkg.ctaLabel}
                </CTAButton>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} className="mt-10 text-center">
          <CTAButton to="/pricing" variant="ghost">See full package details &amp; pricing</CTAButton>
        </motion.div>
      </motion.div>
    </section>
  )
}

function WhyMe() {
  const { ref, controls } = useScrollAnimation()

  return (
    <section className="py-24 bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div variants={fadeUp} initial="hidden" animate={controls} className="max-w-2xl mb-14">
          <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">Why Me</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            No agency bloat. No templates. No excuses.
          </h2>
        </motion.div>
        <WhyMeGrid />
      </div>
    </section>
  )
}

function Proof() {
  const spotlightAnim = useScrollAnimation()
  const stripAnim = useScrollAnimation()
  const [spotlight, ...rest] = caseStudies
  const featuredTemplates = templateStyles.slice(0, 3)

  return (
    <section className="bg-gray-100 dark:bg-dark-bg">
      {/* Spotlight: the strongest proof point on the site gets room to
          actually land — full-screen photo, huge type — instead of being
          squeezed into a third of a small card. */}
      <div ref={spotlightAnim.ref} className="relative min-h-[90vh] flex items-end overflow-hidden">
        <img src={spotlight.image} alt={spotlight.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className={`absolute inset-0 bg-gradient-to-t ${spotlight.accent}`} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={spotlightAnim.controls}
          className="relative w-full max-w-7xl mx-auto px-6 pb-16 sm:pb-24"
        >
          <p className="text-emerald-accent font-bold text-sm sm:text-base uppercase tracking-[0.3em] mb-5">
            Proof, Not Promises
          </p>
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-white/90 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full mb-6">
            {spotlight.niche}
          </span>
          <h2 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white leading-[0.95] mb-6 max-w-4xl">
            {spotlight.title}
          </h2>
          <p className="text-white/85 text-lg sm:text-xl max-w-2xl leading-relaxed mb-9">
            {spotlight.outcome}
          </p>
          <div className="flex flex-wrap gap-4">
            <CTAButton href={spotlight.href} size="lg">View live site</CTAButton>
            <CTAButton
              to="/work"
              size="lg"
              variant="secondary"
              className="!border-white/30 !text-white hover:!border-white hover:!text-white"
            >
              See all work &amp; case studies
            </CTAButton>
          </div>
        </motion.div>
      </div>

      <motion.div
        ref={stripAnim.ref}
        variants={staggerContainer}
        initial="hidden"
        animate={stripAnim.controls}
        className="max-w-7xl mx-auto px-6 py-20"
      >
        {/* The rest of the real work — compact, since the spotlight already
            made the case */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {rest.map(project => (
            <motion.div key={project.title} variants={fadeUp} className="group relative rounded-2xl overflow-hidden h-44">
              <CaseStudyTile project={project} compact />
              <Link to="/work" className="absolute inset-0" aria-label={`Read the ${project.title} case study`} />
            </motion.div>
          ))}
        </div>

        {/* Template teaser — cheaper/faster starting points, not portfolio work */}
        <motion.div variants={fadeUp} className="pt-14 border-t border-gray-200 dark:border-dark-border">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-2">Need It Faster?</p>
              <h3 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Or start from a proven layout.</h3>
            </div>
            <Link to="/work#templates" className="text-sm font-semibold text-gray-900 dark:text-white hover:text-emerald-accent transition-colors inline-flex items-center gap-1">
              See all templates
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {featuredTemplates.map(t => (
              <motion.div key={t.title} variants={fadeUp} className="group relative rounded-2xl overflow-hidden h-56 sm:h-64">
                <TemplateTile template={t} compact />
                <a href={t.href} target="_blank" rel="noopener noreferrer" className="absolute inset-0" aria-label={`Preview the ${t.title} template`} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function HowItWorks() {
  const { ref, controls } = useScrollAnimation()

  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-dark-bg scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div variants={fadeUp} initial="hidden" animate={controls} className="max-w-2xl mb-14">
          <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Buying this should feel easy. Here's how it works.
          </h2>
        </motion.div>
        <ProcessStrip />
      </div>
    </section>
  )
}

function ObjectionsSection() {
  const { ref, controls } = useScrollAnimation()

  return (
    <section className="py-24 bg-gray-100 dark:bg-dark-bg">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div variants={fadeUp} initial="hidden" animate={controls} className="max-w-2xl mb-14">
          <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">Before You Ask</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Let's answer the objections before you type them.
          </h2>
        </motion.div>
        <Objections />
      </div>
    </section>
  )
}

function FinalCTA() {
  const { ref, controls } = useScrollAnimation()

  return (
    <section className="relative overflow-hidden py-28 bg-gradient-to-br from-emerald-950 via-gray-900 to-black">
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-accent/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls} className="relative max-w-3xl mx-auto px-6 text-center">
        <motion.h2 variants={fadeUp} className="font-heading text-3xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
          Let's build the website your business should have had already.
        </motion.h2>
        <motion.p variants={fadeUp} className="text-gray-400 leading-relaxed mb-10 max-w-xl mx-auto text-lg">
          Tell me what you're building and what "done" looks like. I'll reply with next steps and a real quote.
        </motion.p>
        <motion.div variants={fadeUp}>
          <CTAButton to="/contact" size="lg">{primaryCta}</CTAButton>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Pain />
      <Solution />
      <Offer />
      <WhyMe />
      <Proof />
      <HowItWorks />
      <ObjectionsSection />
      <FinalCTA />
    </>
  )
}
