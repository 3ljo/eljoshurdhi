import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/theme'
import { navLinks, primaryCta, brand } from '../lib/siteConfig'
import { sheetFor } from '../lib/sheets'
import CTAButton from './ui/CTAButton'
import { Icon } from './drawing/Icons'

function Mark() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9 flex-none" aria-hidden="true">
      <rect x="0.75" y="0.75" width="46.5" height="46.5" rx="3" fill="none" stroke="var(--line)" strokeWidth="1.5" />
      <path d="M11 13H21M11 24H19M11 35H21M11 13V35" stroke="var(--ink)" strokeWidth="3" strokeLinecap="square" fill="none" />
      <path
        d="M37 15.5C37 13.5 35.2 12.5 32.5 12.5C29.6 12.5 27.5 13.9 27.5 16.8C27.5 22.6 37.5 20.4 37.5 27.6C37.5 30.9 35 32.6 32 32.6C29 32.6 27 31.3 26.8 28.6"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinecap="square"
        fill="none"
      />
      <circle cx="38" cy="38" r="4" fill="var(--action)" />
    </svg>
  )
}

// The nav is the set's sheet index: each link carries its sheet number
// where the header has room for it.
function SheetNumber({ href }) {
  return <span className="t-mono mr-2 hidden text-[0.6875rem] text-ink-2 xl:inline">{sheetFor(href).number}</span>
}

// White print (light) / blue print (dark), the two prints of the drawing.
function PrintToggle({ className = '' }) {
  const { dark, toggle } = useTheme()
  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center gap-2 rounded-[2px] border border-rule text-[0.95rem] font-medium transition-colors duration-200 hover:border-line ${className}`}
      aria-label={dark ? 'Switch to the white print (light mode)' : 'Switch to the blue print (dark mode)'}
    >
      <span
        className="h-4 w-4 rounded-[2px] border border-line"
        style={{ background: dark ? '#f1f4f6' : '#0d2c4d' }}
        aria-hidden="true"
      />
      {dark ? 'White print' : 'Blue print'}
    </button>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScroll = useRef(0)
  const openButton = useRef(null)
  const closeButton = useRef(null)
  const menu = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const sheet = sheetFor(location.pathname)

  // While the sheet index is open: lock the page, move focus in, keep Tab
  // inside, close on Escape, and hand focus back to the button on close.
  useEffect(() => {
    if (!menuOpen) return undefined
    const opener = openButton.current
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()

    const onKey = e => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        return
      }
      if (e.key !== 'Tab' || !menu.current) return
      const focusable = menu.current.querySelectorAll('a[href], button:not([disabled])')
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
      window.removeEventListener('keydown', onKey)
      opener?.focus()
    }
  }, [menuOpen])

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY
      setHidden(current > lastScroll.current && current > 160)
      lastScroll.current = current
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // In-page links ("/#how-it-works"): scroll if already home, else navigate
  // and let App scroll once the page renders.
  const goToHash = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    const id = href.split('#')[1]
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView()
    } else {
      navigate(href)
    }
  }

  const desktopLink = ({ isActive }) =>
    `relative py-2 text-[1rem] font-medium transition-colors duration-200 ${
      isActive ? 'text-ink after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:bg-action' : 'text-ink-2 hover:text-ink'
    }`

  const sheetLinks = [{ label: 'Home', href: '/', type: 'route' }, ...navLinks, { label: 'Contact', href: '/contact', type: 'route' }]

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 border-b border-rule bg-paper transition-transform duration-300 motion-reduce:transition-none"
        style={{
          transform: hidden && !menuOpen ? 'translateY(-100%)' : 'translateY(0)',
          transitionTimingFunction: 'var(--ease-out)',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        <nav className="wrap flex h-[68px] items-center justify-between gap-6" aria-label="Main">
          <Link to="/" className="flex min-w-0 items-center gap-3 no-underline" aria-label={`${brand.name}, home`}>
            <Mark />
            <span className="min-w-0 leading-none">
              <span className="block font-display text-[1.35rem] font-semibold tracking-[0.01em] text-ink">{brand.name}</span>
              <span className="t-mono mt-1 block truncate text-[0.6875rem] text-ink-2">
                {sheet.number} · {sheet.title}
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map(link =>
              link.type === 'hash' ? (
                <a key={link.href} href={link.href} onClick={e => goToHash(e, link.href)} className="py-2 text-[1rem] font-medium text-ink-2 no-underline transition-colors duration-200 hover:text-ink">
                  <SheetNumber href="/" />
                  {link.label}
                </a>
              ) : (
                <NavLink key={link.href} to={link.href} className={desktopLink} style={{ textDecoration: 'none' }}>
                  <SheetNumber href={link.href} />
                  {link.label}
                </NavLink>
              ),
            )}
            <PrintToggle className="h-11 px-3" />
            <CTAButton to="/contact" className="min-h-11 px-5 text-base">
              {primaryCta}
            </CTAButton>
          </div>

          <button
            ref={openButton}
            type="button"
            className="btn btn-secondary min-h-11 gap-2.5 px-4 text-base lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="sheet-index"
          >
            <Icon name="menu" className="h-5 w-5" strokeWidth={2} />
            Menu
          </button>
        </nav>
      </header>

      <div
        ref={menu}
        id="sheet-index"
        role="dialog"
        aria-modal="true"
        aria-label="Sheet index"
        data-open={menuOpen}
        className="sheet-menu fixed inset-0 z-[60] flex flex-col bg-paper lg:hidden"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="wrap flex h-[68px] flex-none items-center justify-between border-b border-rule">
          <span className="t-mono text-ink-2">Sheet index</span>
          <span className="flex items-center gap-2">
            <PrintToggle className="h-11 px-3" />
            <button
              ref={closeButton}
              type="button"
              className="btn btn-secondary min-h-11 px-3"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <Icon name="close" className="h-5 w-5" strokeWidth={2} />
            </button>
          </span>
        </div>
        <ul className="wrap mt-4 mb-0 flex-1 list-none overflow-y-auto p-0">
          {sheetLinks.map(link => {
            const number = sheetFor(link.type === 'route' ? link.href : '/').number
            const current = link.type === 'route' && link.href === location.pathname
            const inner = (
              <>
                <span className="t-mono w-16 text-ink-2">{number}</span>
                <span className={`font-display text-[2.4rem] font-semibold leading-none ${current ? 'text-action' : 'text-ink'}`}>
                  {link.label}
                </span>
              </>
            )
            return (
              <li key={link.href} className="border-b border-rule">
                {link.type === 'hash' ? (
                  <a href={link.href} onClick={e => goToHash(e, link.href)} className="flex items-baseline gap-4 py-4 no-underline">
                    {inner}
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-baseline gap-4 py-4 no-underline"
                    aria-current={current ? 'page' : undefined}
                  >
                    {inner}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
        <div className="wrap flex-none border-t border-rule py-5">
          <CTAButton to="/contact" size="lg" arrow className="w-full" onClick={() => setMenuOpen(false)}>
            {primaryCta}
          </CTAButton>
        </div>
      </div>
    </>
  )
}
