import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollAnimation, fadeUp, slideLeft, slideRight, staggerContainer } from '../hooks/useScrollAnimation'
gsap.registerPlugin(ScrollTrigger)

const techStack = [
  { name: 'React', icon: '⚛' },
  { name: 'Node.js', icon: '▲' },
  { name: 'TypeScript', icon: 'TS' },
  { name: 'Python', icon: 'Py' },
  { name: 'MongoDB', icon: '🍃' },
  { name: 'PostgreSQL', icon: '🐘' },
  { name: 'Docker', icon: '🐳' },
  { name: 'AWS', icon: '☁' },
  { name: 'Git', icon: '⎇' },
  { name: 'Figma', icon: '◈' },
  { name: 'Tailwind', icon: '🌊' },
  { name: 'Next.js', icon: 'N' },
]

const stats = [
  { value: 25, suffix: '+', label: 'Projects Done' },
  { value: 15, suffix: '+', label: 'Happy Clients' },
  { value: 4, suffix: '+', label: 'Years Experience' },
]

export default function About() {
  const { ref, controls } = useScrollAnimation()
  const statsRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const counters = gsap.utils.toArray('.stat-value')
      counters.forEach(el => {
        const target = parseInt(el.dataset.value, 10)
        gsap.fromTo(el, { innerText: 0 }, {
          innerText: target,
          duration: 2,
          ease: 'power2.out',
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            once: true,
          },
        })
      })
    }, statsRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="py-24 lg:py-32 bg-white dark:bg-dark-bg">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={controls}
        className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center"
      >
        {/* Tech Stack Grid */}
        <motion.div variants={slideLeft} className="flex justify-center">
          <div className="grid grid-cols-3 gap-4 w-full max-w-md">
            {techStack.map((tech, i) => (
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
            I'm Eljo Shurdhi, a Computer Engineer with an IT degree and a deep passion
            for full-stack development. I specialize in crafting clean, scalable web
            applications that merge technical excellence with intuitive design.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
            From concept to deployment, I bring ideas to life using modern technologies
            like React, Node.js, and cloud-native architectures. I believe great software
            isn't just functional — it should feel effortless.
          </p>

          {/* Quote */}
          <blockquote className="mb-10 pl-5 border-l-2 border-emerald-accent">
            <p className="text-gray-500 dark:text-gray-400 italic text-sm leading-relaxed">
              "The only way to do great work is to love what you do."
            </p>
            <cite className="text-xs text-gray-400 dark:text-gray-500 not-italic mt-2 block">
              — Steve Jobs
            </cite>
          </blockquote>

          {/* Stats */}
          <div ref={statsRef} className="grid grid-cols-3 gap-6">
            {stats.map(stat => (
              <div key={stat.label} className="text-center lg:text-left">
                <p className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white">
                  <span className="stat-value" data-value={stat.value}>0</span>
                  {stat.suffix}
                </p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
