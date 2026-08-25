import { motion } from 'framer-motion'
import { packages, caseStudies, brand } from '../lib/siteConfig'
import { useScrollAnimation, fadeUp, staggerContainer } from '../hooks/useScrollAnimation'
import CTAButton from '../components/ui/CTAButton'
import ProofStrip from '../components/ProofStrip'

const heroImgLight = '/Confident young man in black T-shirt.png'
const heroImgDark = '/Confident portrait with casual style.png'

function Hero() {
  return (
    <section className="relative overflow-hidden bg-light-bg dark:bg-dark-bg pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Floating gradient orbs */}
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
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}>
          <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-4">
            Currently taking on new projects
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.1] mb-6">
            Your website should get you clients, not just compliments.
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mb-9 leading-relaxed">
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
          className="relative justify-self-center"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-accent/20 to-transparent rounded-2xl blur-3xl scale-110" />
          <picture>
            <source srcSet={heroImgDark} media="(prefers-color-scheme: dark)" />
            <img
              src={heroImgLight}
              alt={`${brand.name}, ${brand.role.toLowerCase()}`}
              className="relative w-64 sm:w-80 lg:w-[26rem] object-cover rounded-2xl drop-shadow-2xl"
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
    <section className="py-24 bg-gray-100 dark:bg-dark-bg">
      <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls} className="max-w-7xl mx-auto px-6">
        <motion.div variants={fadeUp} className="max-w-2xl mb-14">
          <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">What I Build</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Pick your starting point<span className="text-emerald-accent">.</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            Four ways to work together, from a single landing page to a fully custom build.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {packages.map(pkg => (
            <motion.a
              key={pkg.slug}
              href="/pricing"
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className={`group flex flex-col h-full rounded-2xl p-6 bg-white dark:bg-dark-card border transition-all duration-300 ${
                pkg.recommended
                  ? 'border-emerald-accent/40 shadow-lg shadow-emerald-accent/10'
                  : 'border-gray-200 dark:border-dark-border hover:border-emerald-accent/40 hover:shadow-lg hover:shadow-emerald-accent/5'
              }`}
            >
              {/* Reserved badge row on every card, visible only on the recommended one, so
                  every card's title starts at the same height. */}
              <span className="block h-4 text-[10px] font-semibold uppercase tracking-widest text-emerald-accent mb-2">
                {pkg.recommended ? 'Most popular' : ''}
              </span>
              <h3 className="font-heading font-semibold text-gray-900 dark:text-white">{pkg.name}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{pkg.forWho}</p>

              <div className="mt-auto pt-4">
                <p className="text-lg font-heading font-bold text-gray-900 dark:text-white">
                  {pkg.price} <span className="text-xs font-sans font-normal text-gray-400 dark:text-gray-500">{pkg.priceNote}</span>
                </p>
                <span className="mt-3 text-sm font-medium text-emerald-accent inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  See details
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </span>
              </div>
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
    <section className="py-24 bg-white dark:bg-dark-bg">
      <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls} className="max-w-7xl mx-auto px-6">
        <motion.div variants={fadeUp} className="max-w-2xl mb-14">
          <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">Proof, Not Promises</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Live projects, not mockups<span className="text-emerald-accent">.</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
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
                <span className="text-[10px] font-semibold uppercase tracking-widest text-white/90 mb-2">{project.niche}</span>
                <h3 className="font-heading text-xl font-bold text-white mb-1">{project.title}</h3>
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
    <section className="py-24 bg-gray-100 dark:bg-dark-bg">
      <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls} className="max-w-4xl mx-auto px-6">
        <motion.div variants={fadeUp} className="rounded-3xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card p-10 sm:p-14 text-center">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Let's build something that sells<span className="text-emerald-accent">.</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-xl mx-auto">
            Tell me what you're building and what "done" looks like — I'll reply with next steps and a real quote.
          </p>
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
