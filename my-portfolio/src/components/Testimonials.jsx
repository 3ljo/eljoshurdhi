import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation, fadeUp } from '../hooks/useScrollAnimation'

const testimonials = [
  {
    name: 'Marco R.',
    role: 'Startup Founder',
    text: 'Eljo delivered exactly what we needed — clean code, on time, and with great communication throughout. Highly recommend.',
    stars: 5,
  },
  {
    name: 'Sara B.',
    role: 'Product Manager',
    text: 'Working with Eljo was a fantastic experience. He understood our vision immediately and translated it into a pixel-perfect product.',
    stars: 5,
  },
  {
    name: 'David K.',
    role: 'CTO, TechVentures',
    text: 'One of the most reliable developers I\'ve worked with. Great technical skills and even better problem-solving mindset.',
    stars: 5,
  },
  {
    name: 'Anja M.',
    role: 'Design Lead',
    text: 'Eljo bridges the gap between design and development effortlessly. Every component was built with precision and care.',
    stars: 5,
  },
  {
    name: 'Thomas L.',
    role: 'Freelance Client',
    text: 'From concept to deployment, the entire process was smooth. My project was delivered ahead of schedule with no bugs.',
    stars: 5,
  },
]

const CARD_WIDTH = 380
const GAP = 24

export default function Testimonials() {
  const { ref, controls } = useScrollAnimation()
  const [paused, setPaused] = useState(false)
  const trackRef = useRef(null)

  const doubled = [...testimonials, ...testimonials]

  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-gray-50 dark:bg-dark-card overflow-hidden">
      <motion.div
        ref={ref}
        variants={fadeUp}
        initial="hidden"
        animate={controls}
        className="max-w-7xl mx-auto px-6 mb-12"
      >
        <div className="text-center">
          <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            What People Say<span className="text-emerald-accent">.</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Feedback from clients and collaborators I've had the pleasure of working with.
          </p>
        </div>
      </motion.div>

      {/* Infinite Carousel */}
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          ref={trackRef}
          className="flex gap-6"
          animate={{ x: [0, -(CARD_WIDTH + GAP) * testimonials.length] }}
          transition={{
            x: {
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
              ...(paused && { duration: 0 }),
            },
          }}
          style={{ width: 'max-content' }}
        >
          {doubled.map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 p-8 rounded-2xl bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border"
              style={{ width: CARD_WIDTH }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <svg key={j} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 italic">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-accent/20 flex items-center justify-center text-emerald-accent font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
