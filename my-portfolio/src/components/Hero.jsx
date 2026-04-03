import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { useTheme } from '../context/ThemeContext'
import { Lens } from './ui/lens'

const heroImgLight = '/Confident young man in black T-shirt.png'
const heroImgDark = '/Confident portrait with casual style.png'

const socials = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/eljo-shurdhi-6580111bb/',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/3ljo',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/355682080411',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:shurdhieljo@outlook.com',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
]

export default function Hero() {
  const { dark } = useTheme()
  const textRef = useRef(null)
  const [lensHovering, setLensHovering] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('.hero-greeting', { opacity: 0, y: 30, duration: 0.6 })
        .from('.hero-name', { opacity: 0, y: 50, duration: 0.8 }, '-=0.2')
        .from('.hero-title', { opacity: 0, y: 30, duration: 0.6 }, '-=0.3')
        .from('.hero-tagline', { opacity: 0, duration: 0.6 }, '-=0.2')
        .from('.hero-cta', { opacity: 0, y: 20, duration: 0.5, stagger: 0.15 }, '-=0.2')
    }, textRef)

    return () => ctx.revert()
  }, [])

  const handleScroll = (e, id) => {
    e.preventDefault()
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen min-h-[100dvh] flex items-center overflow-hidden bg-light-bg dark:bg-dark-bg pt-20 pb-16">
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
      <motion.div
        className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-emerald-light/5 blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
        {/* Text Side */}
        <div ref={textRef} className="order-2 lg:order-1 text-center lg:text-left">
          <p className="hero-greeting text-emerald-accent font-medium text-lg mb-4">
            Hi, I'm
          </p>
          <h1 className="hero-name text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
            Eljo<br />Shurdhi<span className="text-emerald-accent">.</span>
          </h1>
          <div className="hero-title flex items-center gap-2 justify-center lg:justify-start mb-6">
            <div className="w-8 h-0.5 bg-emerald-accent" />
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-medium">
              Full Stack Developer
            </p>
          </div>
          <p className="hero-tagline text-gray-500 dark:text-gray-500 text-base sm:text-lg max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed">
            Computer Engineer crafting robust digital experiences with clean architecture,
            modern tech stacks, and a passion for pixel-perfect design.
          </p>
          <div className="flex gap-3 sm:gap-4 justify-center lg:justify-start flex-wrap">
            <a
              href="#portfolio"
              onClick={e => handleScroll(e, '#portfolio')}
              className="hero-cta px-5 sm:px-7 py-3 sm:py-3.5 bg-emerald-accent hover:bg-emerald-dark text-white font-semibold text-sm sm:text-base rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-emerald-accent/25"
            >
              View My Work
            </a>
            <a
              href="#contact"
              onClick={e => handleScroll(e, '#contact')}
              className="hero-cta px-5 sm:px-7 py-3 sm:py-3.5 border-2 border-gray-300 dark:border-dark-border text-gray-900 dark:text-white font-semibold text-sm sm:text-base rounded-full hover:border-emerald-accent hover:text-emerald-accent transition-all duration-300"
            >
              Let's Talk
            </a>
          </div>
        </div>

        {/* Portrait Side */}
        <div className="order-1 lg:order-2 flex justify-center">
          <motion.div
            className="relative"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-accent/20 to-transparent rounded-2xl blur-3xl scale-110" />
            <Lens hovering={lensHovering} setHovering={setLensHovering} zoomFactor={1.6} lensSize={150}>
              <img
                src={dark ? heroImgDark : heroImgLight}
                alt="Eljo Shurdhi"
                className="relative w-52 sm:w-72 lg:w-[420px] object-cover drop-shadow-2xl"
              />
            </Lens>
          </motion.div>
        </div>
      </div>

      {/* Social sidebar */}
      <div className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col gap-4 items-center z-20">
        <div className="w-px h-20 bg-gray-200 dark:bg-dark-border mb-2" />
        {socials.map(s => (
          <motion.a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.15, color: '#10B981' }}
            className="w-10 h-10 rounded-full border border-gray-200 dark:border-dark-border flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-emerald-accent hover:text-emerald-accent transition-colors"
            aria-label={s.label}
          >
            {s.icon}
          </motion.a>
        ))}
        <div className="w-px h-20 bg-gray-200 dark:bg-dark-border mx-auto mt-2" />
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <span className="text-xs text-gray-400 uppercase tracking-widest">Scroll</span>
        <svg className="w-5 h-5 text-emerald-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  )
}
