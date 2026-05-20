import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useScrollAnimation, fadeUp, staggerContainer } from '../hooks/useScrollAnimation'

const skills = [
  {
    num: '01',
    title: 'Frontend Engineering',
    description: 'React, Next.js, TypeScript, Tailwind. Component architecture, state management, and accessible, responsive UIs.',
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Framer Motion'],
  },
  {
    num: '02',
    title: 'Backend & APIs',
    description: 'REST and server-action APIs with Node.js and Next.js. Auth flows, role-based access, and data validation.',
    tags: ['Node.js', 'REST', 'Auth', 'Zod'],
  },
  {
    num: '03',
    title: 'Databases',
    description: 'Relational schema design and queries with PostgreSQL and Supabase. Comfortable with row-level security and migrations.',
    tags: ['PostgreSQL', 'Supabase', 'SQL'],
  },
  {
    num: '04',
    title: 'AI Integrations',
    description: 'Shipping production AI features — OpenAI for chat and structured output, Twilio for voice agents, and prompt engineering.',
    tags: ['OpenAI', 'Twilio', 'Prompt Engineering'],
  },
  {
    num: '05',
    title: 'UI / UX',
    description: 'Figma to code. Translating designs into clean, maintainable components without losing visual fidelity.',
    tags: ['Figma', 'Design Systems', 'Responsive'],
  },
  {
    num: '06',
    title: 'DevOps & Deployment',
    description: 'Vercel, GitHub Actions, environment management, and shipping to production with confidence.',
    tags: ['Vercel', 'Git', 'CI/CD'],
  },
]

export default function Services() {
  const { ref, controls } = useScrollAnimation()

  return (
    <section id="services" className="py-24 lg:py-32 bg-gray-100 dark:bg-dark-bg relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={controls}
        className="max-w-6xl mx-auto px-6 relative z-10"
      >
        {/* Section Header */}
        <motion.div variants={fadeUp} className="text-center mb-14">
          <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">What I Do</p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Skills & Stack<span className="text-emerald-accent">.</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            The areas I work in day-to-day, with the tools I actually use in production.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map(skill => (
            <motion.div
              key={skill.num}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="group p-6 sm:p-7 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border hover:border-emerald-accent/40 hover:shadow-lg hover:shadow-emerald-accent/5 transition-all duration-300"
            >
              <span className="text-xs font-mono text-emerald-accent/60 group-hover:text-emerald-accent transition-colors">
                {skill.num}
              </span>
              <h3 className="mt-2 mb-3 text-xl font-heading font-semibold text-gray-900 dark:text-white group-hover:text-emerald-accent transition-colors">
                {skill.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                {skill.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {skill.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-dark-bg border border-gray-200 dark:border-dark-border px-2.5 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card p-10 text-center">
          <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">Dedicated pricing page</p>
          <h3 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            View complete packages on a separate page.
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            I created a dedicated pricing view so your packages feel more polished and easier to compare.
          </p>
          <Link
            to="/pricing"
            className="inline-flex items-center justify-center rounded-full bg-emerald-accent px-7 py-4 text-sm font-semibold text-white hover:bg-emerald-dark transition-colors"
          >
            See pricing packages
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
