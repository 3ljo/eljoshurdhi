import { useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import RunningHead from './components/RunningHead'
import Colophon from './components/Colophon'
import Home from './pages/Home'
import Services from './pages/Services'
import Work from './pages/Work'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import { focusSection } from './lib/focusSection'

const titles = {
  '/': 'Eljo Shurdhi — Websites Built to Bring You Customers',
  '/work': 'Work — Eljo Shurdhi',
  '/pricing': 'Pricing — Eljo Shurdhi',
  '/about': 'Why me — Eljo Shurdhi',
  '/contact': 'Start your project — Eljo Shurdhi',
}

// Starts every new page at the top, or at an in-page anchor (e.g. a link to
// "/#how-it-works" from another page) once the target route has rendered.
// Each navigation also titles the page and moves focus to its heading or
// anchor, so screen readers hear the change. Anchor scrolls follow the CSS
// scroll-behavior, which is smooth only when the visitor allows motion.
function ScrollToTop() {
  const { pathname, hash, key } = useLocation()
  const first = useRef(true)

  useEffect(() => {
    // Router matching ignores case and trailing slashes; so does the title.
    const route = pathname.replace(/\/+$/, '').toLowerCase() || '/'
    document.title = titles[route] ?? 'Page not found — Eljo Shurdhi'
  }, [pathname])

  useEffect(() => {
    const initial = first.current
    first.current = false
    if (hash) {
      const id = hash.replace('#', '')
      if (focusSection(id)) return undefined
      const timeoutId = window.setTimeout(() => focusSection(id), 100)
      return () => window.clearTimeout(timeoutId)
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    if (!initial) {
      const heading = document.querySelector('main h1')
      if (heading) {
        heading.setAttribute('tabindex', '-1')
        heading.focus({ preventScroll: true })
      }
    }
    return undefined
  }, [pathname, hash, key])

  return null
}

function App() {
  return (
    <div className="site">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <RunningHead />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Services />} />
        <Route path="/work" element={<Work />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Colophon />
    </div>
  )
}

export default App
