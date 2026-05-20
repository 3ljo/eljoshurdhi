import { motion } from 'framer-motion'
import { useScrollAnimation, fadeUp, slideLeft, slideRight, staggerContainer } from '../hooks/useScrollAnimation'

// Stack actually used across the portfolio projects.
const techStack = [
  { name: 'React', icon: '⚛' },
  { name: 'Next.js', icon: 'N' },
  { name: 'TypeScript', icon: 'TS' },
  { name: 'Node.js', icon: '▲' },
  { name: 'Tailwind', icon: '🌊' },
  { name: 'Supabase', icon: '⚡' },
  { name: 'PostgreSQL', icon: '🐘' },
  { name: 'OpenAI API', icon: 'AI' },
  { name: 'Framer Motion', icon: '◆' },
  { name: 'Angular', icon: 'A' },
  { name: 'Git', icon: '⎇' },
  { name: 'Figma', icon: '◈' },
]

export default function About() {
  const { ref, controls } = useScrollAnimation()

  return (
    <section id="about" className="py-24 lg:py-32 bg-white dark:bg-dark-bg">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={controls}
        className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start"
      >
        {/* Tech Stack Grid */}
        <motion.div variants={slideLeft} className="flex justify-center lg:sticky lg:top-28">
          <div className="grid grid-cols-3 gap-4 w-full max-w-md">
            {techStack.map(tech => (
              <motion.div
                key={tech.name}
                whileHover={{ y: -4, scale: 1.05 }}
                className="group flex flex-col items-center gap-2 p-5 rounded-2xl bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-dark-border hover:border-emerald-accent/40 hover:shadow-lg hover:shadow-emerald-accent/5 transition-all duration-300"
              >
                <span className="text-2xl leading-none">{tech.icon}</span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-emerald-accent transition-colors">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Text Side */}
        <motion.div variants={slideRight}>
          <div className="mb-8">
            <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">About Me</p>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
              Building Digital<br />Experiences<span className="text-emerald-accent">.</span>
            </h2>
            <div className="w-16 h-1 bg-emerald-accent rounded-full" />
          </div>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            I'm Eljo Shurdhi, a Computer Engineer focused on full-stack web development.
            I build production apps end-to-end — from the database schema and API layer
            to the UI components users actually touch.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
            Most of my recent work uses Next.js, React, TypeScript, and Supabase / Postgres
            on the backend. I'm comfortable shipping AI features (OpenAI, Twilio voice) and
            writing the kind of clean, typed code teams can actually maintain.
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
