import { Link } from 'react-router-dom'
import { brand, navLinks } from '../lib/siteConfig'
import { BrandIcon, Icon } from './Icons'

// The colophon: who made the issue, how to reach him, where everything is.
export default function Colophon() {
  const year = new Date().getFullYear()
  const sections = [{ label: 'Cover', href: '/' }, ...navLinks, { label: 'Contact', href: '/contact' }]

  return (
    <footer className="colophon on-ink">
      <div className="wrap">
        <div className="colophon__grid">
          <div>
            <p className="colophon__mark" aria-hidden="true">
              Eljo
            </p>
            <p style={{ marginTop: '1.25rem', maxWidth: '34ch', fontWeight: 700, color: 'var(--on-ink-2)' }}>
              {brand.name}, {brand.location}. Websites built to bring small businesses more customers.
            </p>
          </div>
          <div>
            <h2>Direct line</h2>
            <ul>
              <li>
                <a href={`mailto:${brand.directEmail}`}>
                  <Icon name="mail" />
                  {brand.directEmail}
                </a>
              </li>
              <li>
                <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer">
                  <BrandIcon name="whatsapp" />
                  {brand.whatsappLabel}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2>Elsewhere</h2>
            <ul>
              <li>
                <a href={brand.linkedin} target="_blank" rel="noopener noreferrer">
                  <BrandIcon name="linkedin" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={brand.github} target="_blank" rel="noopener noreferrer">
                  <BrandIcon name="github" />
                  GitHub
                </a>
              </li>
              <li>
                <a href="/eljo-shurdhi-cv.pdf" download>
                  <Icon name="download" />
                  CV (PDF)
                </a>
              </li>
            </ul>
          </div>
          <nav aria-label="Footer">
            <h2>In this issue</h2>
            <ul>
              {sections.map(link => (
                <li key={link.href}>
                  <Link to={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="colophon__base">
          <span>
            © {year} {brand.name} · Issue 01 · {brand.location}
          </span>
          <span>Made in Tirana.</span>
        </div>
      </div>
    </footer>
  )
}
