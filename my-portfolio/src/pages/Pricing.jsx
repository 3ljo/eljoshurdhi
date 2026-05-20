import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useScrollAnimation, fadeUp, staggerContainer } from '../hooks/useScrollAnimation'

const pricingPackages = [
  {
    title: 'Starter Brand Kit',
    price: '$500',
    description: 'Logo, brand colors, typography, 1-page website.',
    deliverables: ['Logo design', 'Brand color palette', 'Typography system', '1-page website'],
    timeframe: 'Delivered in 5 days',
  },
  {
    title: 'Business Website',
    price: '$1,200',
    description: 'Multi-page website, mobile-first, SEO-ready, contact form.',
    deliverables: ['Multi-page website', 'Mobile-first design', 'SEO-ready structure', 'Contact form'],
    timeframe: 'Delivered in 7–10 days',
  },
  {
    title: 'Mobile PWA App',
    price: '$2,500',
    description: 'Progressive Web App, push notifications, offline mode, custom UI.',
    deliverables: ['PWA installable app', 'Push notifications', 'Offline mode', 'Custom UI'],
    timeframe: 'Delivered in 10 days',
  },
  {
    title: 'Content & Video Package',
    price: '$800',
    description: '5 edited videos, social formats (Reels, Ads, Promos), captions included.',
    deliverables: ['5 edited videos', 'Reels + Ad formats', 'Promo clips', 'Captions included'],
    timeframe: 'Delivered in 5 days',
  },
  {
    title: 'AI Automation Package',
    price: '$1,800',
    description: 'AI chatbot, automated leads, email workflows, content pipelines. Saves 10+ hrs/week.',
    deliverables: ['AI chatbot', 'Lead automation', 'Email workflows', 'Content pipelines'],
    timeframe: 'Delivered in 10 days',
  },
  {
    title: 'Full Agency Bundle',
    price: '$5,000',
    description: 'Everything above combined. Best value for a full launch or rebrand.',
    deliverables: ['Brand kit', 'Website', 'PWA app', 'Content + video', 'AI automation'],
    timeframe: 'Delivered in 10 days',
    recommended: true,
  },
  {
    title: 'Monthly Retainer',
    price: '$1,200/mo',
    description: 'Ongoing updates, content, AI maintenance, monthly report.',
    deliverables: ['Regular updates', 'Content support', 'AI maintenance', 'Monthly report'],
    timeframe: 'Billed monthly',
  },
]

export default function Pricing() {
  const { ref, controls } = useScrollAnimation()

  return (
    <main className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      <section className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            ref={ref}
            variants={staggerContainer}
            initial="hidden"
            animate={controls}
            className="text-center"
          >
            <motion.p variants={fadeUp} className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">
              Pricing
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-heading font-extrabold text-gray-900 dark:text-white mb-4">
              Packages for launches, rebrands, and ongoing growth.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Pick the package that fits your business stage. Every option is designed to keep the same polished visual quality and strong performance that your brand deserves.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/" className="text-sm font-semibold text-gray-900 dark:text-white hover:text-emerald-accent transition-colors">
                Back to home
              </Link>
              <a href="/#contact" className="rounded-full bg-emerald-accent px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-dark transition-colors">
                Contact me
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {pricingPackages.map(pkg => (
              <motion.div
                key={pkg.title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className={`rounded-[2rem] border p-8 bg-white dark:bg-dark-card transition-all duration-300 ${pkg.recommended ? 'border-emerald-accent/40 shadow-2xl shadow-emerald-accent/10' : 'border-gray-200 dark:border-dark-border hover:border-emerald-accent/40 hover:shadow-lg hover:shadow-emerald-accent/5'}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-accent">
                      {pkg.title}
                    </p>
                    <p className="mt-4 text-3xl font-heading font-black text-gray-900 dark:text-white">
                      {pkg.price}
                    </p>
                  </div>
                  {pkg.recommended && (
                    <span className="rounded-full bg-emerald-accent/10 px-3 py-2 text-[11px] font-semibold uppercase text-emerald-accent">
                      Recommended
                    </span>
                  )}
                </div>

                <p className="mt-6 text-gray-500 dark:text-gray-400 leading-relaxed">
                  {pkg.description}
                </p>

                <div className="mt-8 space-y-4">
                  {pkg.deliverables.map(item => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-accent" />
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-between gap-3 text-sm text-gray-400 dark:text-gray-500">
                  <span>{pkg.timeframe}</span>
                  <a
                    href="/#contact"
                    className={`inline-flex items-center justify-center rounded-full px-5 py-3 font-semibold transition-colors duration-300 ${pkg.recommended ? 'bg-emerald-accent text-white hover:bg-emerald-dark' : 'border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white hover:border-emerald-accent hover:text-emerald-accent'}`}
                  >
                    Contact me
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
