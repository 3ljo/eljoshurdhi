import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { navLinks, primaryCta } from '../lib/siteConfig'
import { focusSection } from '../lib/focusSection'
import { Icon } from './Icons'

// The magazine's running head: title and issue on the left, sections and
// the one call to action on the right. On phones the sections open as the
// issue's contents page.
export default function RunningHead() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lastScroll = useRef(0)
  const openButton = useRef(null)
  const closeButton = useRef(null)
  const panel = useRef(null)
  // False when the menu closes because a link was chosen: focus then goes to
  // the destination, not back to the menu button.
  const returnFocus = useRef(true)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      setHidden(y > lastScroll.current && y > 420)
      lastScroll.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // While the contents page is open: lock the page, move focus in, keep Tab
  // inside, close on Escape, and hand focus back to the button on close.
  useEffect(() => {
    if (!open) return undefined
    const opener = openButton.current
    returnFocus.current = true
    document.body.style.overflow = 'hidden'
    // Everything behind the contents page leaves the accessibility tree.
    const behind = ['.skip-link', '.runhead', '#main', '.colophon'].map(sel => document.querySelector(sel)).filter(Boolean)
    behind.forEach(el => el.setAttribute('inert', ''))
    closeButton.current?.focus({ preventScroll: true })
    const onKey = e => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key !== 'Tab' || !panel.current) return
      const focusable = panel.current.querySelectorAll('a[href], button:not([disabled])')
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      behind.forEach(el => el.removeAttribute('inert'))
      window.removeEventListener('keydown', onKey)
      if (returnFocus.current) opener?.focus({ preventScroll: true })
    }
  }, [open])

  // "/#how-it-works": scroll when already home, otherwise navigate and let
  // the app scroll once Home renders.
  const goToHash = (e, href) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    returnFocus.current = false
    setOpen(false)
    const id = href.split('#')[1]
    if (location.pathname === '/') requestAnimationFrame(() => focusSection(id))
    else navigate(href)
  }
  const chooseRoute = () => {
    returnFocus.current = false
    setOpen(false)
  }

  const contents = [{ label: 'Cover', href: '/', type: 'route' }, ...navLinks, { label: 'Contact', href: '/contact', type: 'route' }]

  return (
    <>
      <header className="runhead" data-hidden={hidden && !open} data-scrolled={scrolled}>
        <nav className="runhead__bar" aria-label="Main">
          <Link to="/" className="runhead__title" aria-label="Eljo Shurdhi, Tirana. Home">
            <span>Eljo</span>
            <span className="dot runhead__city" aria-hidden="true" />
            <span className="runhead__city">Tirana</span>
          </Link>

          <div className="runhead__nav">
            {navLinks.map(link =>
              link.type === 'hash' ? (
                <a key={link.href} href={link.href} onClick={e => goToHash(e, link.href)}>
                  {link.label}
                </a>
              ) : (
                <NavLink key={link.href} to={link.href}>
                  {link.label}
                </NavLink>
              ),
            )}
          </div>
          <Link to="/contact" className="btn runhead__cta">
            {primaryCta}
          </Link>

          <button
            ref={openButton}
            type="button"
            className="runhead__menu"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="contents"
            aria-label="Menu"
          >
            <Icon name="menu" />
            <span className="runhead__menu-label">Menu</span>
          </button>
        </nav>
      </header>

      <div ref={panel} id="contents" className="contents" role="dialog" aria-modal="true" aria-label="Menu" data-open={open}>
        <div className="contents__top">
          <span className="label">Menu</span>
          <button ref={closeButton} type="button" className="runhead__menu" onClick={() => setOpen(false)} aria-label="Close menu">
            <Icon name="close" />
          </button>
        </div>
        <ul className="contents__list">
          {contents.map((link, i) => {
            const current = link.type === 'route' && link.href === location.pathname
            const inner = (
              <>
                <span className="display">{link.label}</span>
                <span className="folio-num tnum">{String(i + 1).padStart(2, '0')}</span>
              </>
            )
            return (
              <li key={link.href}>
                {link.type === 'hash' ? (
                  <a href={link.href} onClick={e => goToHash(e, link.href)}>
                    {inner}
                  </a>
                ) : (
                  <Link to={link.href} onClick={chooseRoute} aria-current={current ? 'page' : undefined}>
                    {inner}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
        <div className="contents__foot">
          <Link to="/contact" className="btn btn-lg" style={{ width: '100%' }} onClick={chooseRoute}>
            {primaryCta}
            <Icon name="arrowRight" className="btn-arrow" />
          </Link>
        </div>
      </div>
    </>
  )
}
