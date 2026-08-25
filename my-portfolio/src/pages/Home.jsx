import { motion } from 'framer-motion'
import { packages, caseStudies, brand } from '../lib/siteConfig'
import { useScrollAnimation, fadeUp, staggerContainer } from '../hooks/useScrollAnimation'
import CTAButton from '../components/ui/CTAButton'
import ProofStrip from '../components/ProofStrip'

const heroImgLight = '/Confident young man in black T-shirt.png'
const heroImgDark = '/Confident portrait with casual style.png'

function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg dark:bg-bg-dark pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="absolute inset-0 grid-texture text-ink/[0.05] dark:text-ink-dark/[0.05] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal dark:text-signal-dark mb-5 inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-signal dark:bg-signal-dark" />
            Currently taking on new projects
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-ink dark:text-ink-dark leading-[1.08] mb-6 text-balance">
            Your website should get you clients, not just compliments.
          </h1>
          <p className="text-lg text-slate dark:text-slate-dark max-w-xl mb-9 leading-relaxed">
            I design and build fast, focused websites and web apps for small businesses and founders —
            live in weeks, built to turn visitors into inquiries.
          </p>
          <div className="flex flex-wrap gap-4 mb-12">
            <CTAButton to="/contact" size="lg">Start your project</CTAButton>
            <CTAButton to="/pricing" variant="secondary" size="lg">See packages &amp; pricing</CTAButton>
          </div>
          <ProofStrip />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative justify-self-center"
        >
          <div className="absolute inset-0 bg-signal/15 dark:bg-signal-dark/15 rounded-[2rem] blur-3xl scale-105" />
          <picture>
            <source srcSet={heroImgDark} media="(prefers-color-scheme: dark)" />
            <img
              src={heroImgLight}
              alt={`${brand.name}, ${brand.role.toLowerCase()}`}
              className="relative w-64 sm:w-80 lg:w-[26rem] object-cover rounded-[2rem] border border-line dark:border-line-dark shadow-2xl"
            />
          </picture>
        </motion.div>
      </div>
    </section>
  )
}

function ServicesTeaser() {
  const { ref, controls } = useScrollAnimation()

  return (
    <section className="py-24 bg-surface dark:bg-bg-dark border-y border-line dark:border-line-dark">
      <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls} className="max-w-7xl mx-auto px-6">
        <motion.div variants={fadeUp} className="max-w-2xl mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal dark:text-signal-dark mb-3">What I build</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink dark:text-ink-dark mb-4">
            Pick your starting point.
          </h2>
          <p className="text-slate dark:text-slate-dark leading-relaxed">
            Four ways to work together, from a single landing page to a fully custom build.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {packages.map(pkg => (
            <motion.a
              key={pkg.slug}
              href="/pricing"
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className={`group flex flex-col rounded-2xl p-6 border transition-colors duration-300 ${
                pkg.recommended
                  ? 'border-signal dark:border-signal-dark bg-bg dark:bg-surface-dark'
                  : 'border-line dark:border-line-dark bg-bg dark:bg-surface-dark hover:border-signal/50 dark:hover:border-signal-dark/50'
              }`}
            >
              {pkg.recommended && (
                <span className="text-[10px] font-mono uppercase tracking-widest text-signal dark:text-signal-dark mb-2">Most popular</span>
              )}
              <h3 className="font-display font-semibold text-ink dark:text-ink-dark">{pkg.name}</h3>
              <p className="mt-1 text-sm text-slate dark:text-slate-dark flex-1">{pkg.forWho}</p>
              <p className="mt-4 font-mono text-lg font-semibold text-ink dark:text-ink-dark">
                {pkg.price} <span className="text-xs font-sans font-normal text-slate dark:text-slate-dark">{pkg.priceNote}</span>
              </p>
              <span className="mt-3 text-sm font-medium text-signal dark:text-signal-dark inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                See details
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </span>
            </motion.a>
          ))}
        </div>

        <motion.div variants={fadeUp} className="mt-10 text-center">
          <CTAButton to="/pricing" variant="secondary">See full packages &amp; pricing</CTAButton>
        </motion.div>
      </motion.div>
    </section>
  )
}

function WorkTeaser() {
  const { ref, controls } = useScrollAnimation()
  const featured = caseStudies.slice(0, 3)

  return (
    <section className="py-24 bg-bg dark:bg-bg-dark">
      <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls} className="max-w-7xl mx-auto px-6">
        <motion.div variants={fadeUp} className="max-w-2xl mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal dark:text-signal-dark mb-3">Proof, not promises</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink dark:text-ink-dark mb-4">
            Live projects, not mockups.
          </h2>
          <p className="text-slate dark:text-slate-dark leading-relaxed">
            Every project below is a real, working product you can click into right now.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {featured.map(project => (
            <motion.a
              key={project.title}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeUp}
              className="group relative rounded-2xl overflow-hidden h-64 block"
            >
              <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className={`absolute inset-0 bg-gradient-to-t ${project.accent}`} />
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/80 mb-2">{project.niche}</span>
                <h3 className="font-display text-xl font-bold text-white mb-1">{project.title}</h3>
                <p className="text-sm text-white/75 leading-snug line-clamp-2">{project.outcome}</p>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div variants={fadeUp} className="mt-10 text-center">
          <CTAButton to="/work" variant="secondary">See all work &amp; case studies</CTAButton>
        </motion.div>
      </motion.div>
    </section>
  )
}

function FinalCTA() {
  const { ref, controls } = useScrollAnimation()

  return (
    <section className="py-24 bg-ink dark:bg-surface-dark">
      <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls} className="max-w-3xl mx-auto px-6 text-center">
        <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-4xl font-bold text-ink-dark mb-4">
          Let's build something that sells.
        </motion.h2>
        <motion.p variants={fadeUp} className="text-ink-dark/70 leading-relaxed mb-9 max-w-xl mx-auto">
          Tell me what you're building and what "done" looks like — I'll reply with next steps and a real quote.
        </motion.p>
        <motion.div variants={fadeUp}>
          <CTAButton to="/contact" size="lg">Start your project</CTAButton>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesTeaser />
      <WorkTeaser />
      <FinalCTA />
    </>
  )
}
