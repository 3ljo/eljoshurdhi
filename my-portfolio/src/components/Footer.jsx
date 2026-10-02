import { Link, useLocation } from 'react-router-dom'
import { brand, navLinks } from '../lib/siteConfig'
import { sheets, sheetFor } from '../lib/sheets'
import { BrandIcon, Icon } from './drawing/Icons'

const divider = 'border-r-[var(--line-soft)]'

// Every sheet ends in its title block: who drew it, how to reach them, the
// index of the set, and the number of the sheet you are on.
export default function Footer() {
  const { pathname } = useLocation()
  const sheet = sheetFor(pathname)
  const year = new Date().getFullYear()
  const sheetLinks = [
    { label: 'Home', href: '/' },
    ...navLinks.filter(l => l.type === 'route'),
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <footer className="border-t border-rule bg-paper pt-14 pb-[env(safe-area-inset-bottom,0px)] sm:pt-20">
      <div className="wrap">
        <dl className="title-block m-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.3fr_1fr_auto]">
          <div className={`sm:border-r ${divider}`}>
            <dt className="tb-label">Designed &amp; built by</dt>
            <dd className="tb-value m-0">{brand.name}</dd>
            <dd className="m-0 mt-0.5 text-[0.95rem] t-muted">{brand.role}</dd>
          </div>
          <div className={`lg:border-r ${divider}`}>
            <dt className="tb-label">Location</dt>
            <dd className="tb-value m-0">{brand.location}</dd>
          </div>
          <div className={`sm:border-r ${divider}`}>
            <dt className="tb-label">Direct line</dt>
            <dd className="m-0 mt-1 flex flex-col gap-1.5">
              <a href={`mailto:${brand.directEmail}`} className="link w-fit font-medium">
                <Icon name="mail" className="h-4 w-4" />
                {brand.directEmail}
              </a>
              <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer" className="link w-fit font-medium">
                <BrandIcon name="whatsapp" />
                WhatsApp {brand.whatsappLabel}
              </a>
              <span className="flex gap-4">
                <a href={brand.linkedin} target="_blank" rel="noopener noreferrer" className="link font-medium">
                  <BrandIcon name="linkedin" />
                  LinkedIn
                </a>
                <a href={brand.github} target="_blank" rel="noopener noreferrer" className="link font-medium">
                  <BrandIcon name="github" />
                  GitHub
                </a>
              </span>
            </dd>
          </div>
          <div className={`lg:border-r ${divider}`}>
            <dt className="tb-label">Sheet index</dt>
            <dd className="m-0 mt-1">
              <ul className="m-0 grid list-none gap-1 p-0">
                {sheetLinks.map(link => (
                  <li key={link.href} className="flex items-baseline gap-3">
                    <span className="t-mono w-12 text-[0.6875rem] text-ink-2">{sheets[link.href].number}</span>
                    <Link to={link.href} className="link font-medium" aria-current={link.href === pathname ? 'page' : undefined}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div className="sm:col-span-2 lg:col-span-1 lg:min-w-44">
            <dt className="tb-label">Sheet</dt>
            <dd className="m-0 mt-1 font-display text-[3rem] font-bold leading-none">{sheet.number}</dd>
            <dd className="t-mono m-0 mt-2 text-ink-2">{sheet.title}</dd>
          </div>
        </dl>
      </div>

      <div className="wrap flex flex-wrap items-center justify-between gap-4 py-6">
        <p className="t-mono text-ink-2">
          © {year} {brand.name} · Drawn and built in Tirana
        </p>
        <button type="button" onClick={() => window.scrollTo({ top: 0 })} className="btn btn-secondary min-h-10 px-3 text-[0.95rem]">
          <Icon name="arrowUp" className="h-4 w-4" strokeWidth={2} />
          Back to top
        </button>
      </div>
    </footer>
  )
}
