import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import RunningHead from './components/RunningHead'
import Colophon from './components/Colophon'
import Home from './pages/Home'
import Services from './pages/Services'
import Work from './pages/Work'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

// Starts every new page at the top, or at an in-page anchor (e.g. a nav link
// to "/#how-it-works" clicked from a page other than Home) once the target
// route has rendered. Anchor scrolls follow the CSS scroll-behavior, which is
// smooth only when the visitor allows motion.
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      const scrollToElement = () => document.getElementById(id)?.scrollIntoView()
      scrollToElement()
      const timeoutId = window.setTimeout(scrollToElement, 100)
      return () => window.clearTimeout(timeoutId)
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

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
