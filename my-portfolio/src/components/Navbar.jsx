import { useState, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { useTheme } from '../context/ThemeContext'
import { navLinks } from '../lib/siteConfig'
import CTAButton from './ui/CTAButton'

export default function Navbar() {
  const { dark, toggle } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const lastScroll = useRef(0)
  const navRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY
      setVisible(current < lastScroll.current || current < 80)
      setScrolled(current > 20)
      lastScroll.current = current
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, { y: visible ? 0 : -100, duration: 0.3, ease: 'power2.out' })
    }
  }, [visible])

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-signal dark:text-signal-dark'
        : 'text-ink/70 dark:text-ink-dark/70 hover:text-ink dark:hover:text-ink-dark'
    }`

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-line dark:border-line-dark shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-ink dark:text-ink-dark">
          eljo<span className="text-signal dark:text-signal-dark">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <NavLink key={link.href} to={link.href} className={linkClass}>
              {link.label}
            </NavLink>
          ))}

          <button
            onClick={toggle}
            className="relative w-10 h-10 rounded-full flex items-center justify-center bg-surface dark:bg-surface-dark border border-line dark:border-line-dark hover:border-signal/50 transition-colors"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {dark ? (
                <motion.svg
                  key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }} className="w-5 h-5 text-signal-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }} className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </motion.svg>
              )}
            </AnimatePresence>
          </button>

          <CTAButton to="/contact" variant="primary">Start a project</CTAButton>
        </div>

        <button
          className="md:hidden w-10 h-10 flex items-center justify-center relative z-50"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <div className="flex flex-col gap-1.5">
            <motion.span animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} transition={{ duration: 0.2 }} className="block w-6 h-0.5 bg-ink dark:bg-ink-dark origin-center" />
            <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.15 }} className="block w-6 h-0.5 bg-ink dark:bg-ink-dark" />
            <motion.span animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} transition={{ duration: 0.2 }} className="block w-6 h-0.5 bg-ink dark:bg-ink-dark origin-center" />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 w-full h-full bg-bg dark:bg-bg-dark z-40 md:hidden"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, minHeight: '100dvh' }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                >
                  <NavLink
                    to={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-3xl font-display font-semibold text-ink dark:text-ink-dark hover:text-signal dark:hover:text-signal-dark transition-colors"
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: navLinks.length * 0.05 + 0.1, duration: 0.3 }}>
                <CTAButton to="/contact" variant="primary" size="lg" onClick={() => setMenuOpen(false)}>
                  Start a project
                </CTAButton>
              </motion.div>
              <button
                onClick={toggle}
                className="mt-2 px-6 py-3 rounded-full bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-sm font-medium text-ink dark:text-ink-dark"
              >
                {dark ? 'Light mode' : 'Dark mode'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
