import { motion } from 'framer-motion'
import { packages, caseStudies, brand, primaryCta } from '../lib/siteConfig'
import { useScrollAnimation, fadeUp, staggerContainer } from '../hooks/useScrollAnimation'
import CTAButton from '../components/ui/CTAButton'
import ProofStrip from '../components/ProofStrip'
import PainPoints from '../components/PainPoints'
import Methodology from '../components/Methodology'
import WhyMeGrid from '../components/WhyMeGrid'
import ProcessStrip from '../components/ProcessStrip'
import Objections from '../components/Objections'

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
    <section className="py-24 bg-dark-bg">
      <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls} className="max-w-5xl mx-auto px-6">
        <motion.div variants={fadeUp} className="max-w-2xl mb-12">
          <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">The Problem</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
            Your website might be losing you customers right now.
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Any of this sound familiar?
          </p>
        </motion.div>

        <PainPoints />

        <motion.p variants={fadeUp} className="mt-10 text-lg text-white font-medium max-w-2xl">
          That's not a marketing problem. That's a website problem — and it's fixable.
        </motion.p>
      </motion.div>
    </section>
  )
}

function Solution() {
  const { ref, controls } = useScrollAnimation()

  return (
    <section className="py-24 bg-white dark:bg-dark-bg">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div variants={fadeUp} initial="hidden" animate={controls} className="max-w-2xl mb-14">
          <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">The Fix</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            A website built like a sales tool, not a brochure.
          </h2>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            Not React, not Next.js, not framework talk — a business transformation with five parts, each one
            earning its place.
          </p>
        </motion.div>
        <Methodology />
      </div>
    </section>
  )
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {packages.map(pkg => (
            <motion.div
              key={pkg.slug}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className={`flex flex-col h-full rounded-2xl p-6 bg-white dark:bg-dark-card border transition-all duration-300 ${
                pkg.recommended
                  ? 'border-emerald-accent/40 shadow-lg shadow-emerald-accent/10'
                  : 'border-gray-200 dark:border-dark-border hover:border-emerald-accent/40 hover:shadow-lg hover:shadow-emerald-accent/5'
              }`}
            >
              <span className="block h-4 text-[10px] font-semibold uppercase tracking-widest text-emerald-accent mb-2">
                {pkg.recommended ? 'Most popular' : ''}
              </span>
              <h3 className="font-heading font-semibold text-gray-900 dark:text-white">{pkg.name}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{pkg.forWho}</p>

              <div className="mt-auto pt-4">
                <p className="text-lg font-heading font-bold text-gray-900 dark:text-white">
                  {pkg.price} <span className="text-xs font-sans font-normal text-gray-400 dark:text-gray-500">{pkg.priceNote}</span>
                </p>
                <CTAButton
                  to={`/contact?type=${pkg.slug}`}
                  variant={pkg.recommended ? 'primary' : 'secondary'}
                  size="md"
                  className="w-full mt-4"
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
  const { ref, controls } = useScrollAnimation()
  const featured = caseStudies.slice(0, 3)

  return (
    <section className="py-24 bg-gray-100 dark:bg-dark-bg">
      <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls} className="max-w-7xl mx-auto px-6">
        <motion.div variants={fadeUp} className="max-w-2xl mb-14">
          <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">Proof, Not Promises</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Real businesses. Real websites. Judge for yourself.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {featured.map(project => (
            <motion.div key={project.title} variants={fadeUp} className="rounded-2xl overflow-hidden bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border flex flex-col">
              <div className="relative h-40 overflow-hidden">
                <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-t ${project.accent}`} />
                <span className="absolute bottom-3 left-4 text-[10px] font-semibold uppercase tracking-widest text-white/90">{project.niche}</span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white mb-3">{project.title}</h3>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Problem</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-3">{project.problem}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Result</p>
                <p className="text-sm text-emerald-accent font-medium leading-relaxed mb-4">{project.result}</p>
                <a href={project.href} target="_blank" rel="noopener noreferrer" className="mt-auto text-sm font-semibold text-gray-900 dark:text-white hover:text-emerald-accent transition-colors inline-flex items-center gap-1">
                  View live site
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} className="mt-10 text-center">
          <CTAButton to="/work" variant="ghost">See all work &amp; case studies</CTAButton>
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
    <section className="py-28 bg-gray-900 dark:bg-black">
      <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls} className="max-w-3xl mx-auto px-6 text-center">
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
