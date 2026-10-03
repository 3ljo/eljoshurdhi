import { Link } from 'react-router-dom'
import { brand, objections, packages, painPoints, primaryCta, processSteps, whyMe } from '../../lib/siteConfig'
import { BrandIcon, Icon } from '../Icons'
import { Picture } from '../Media'

// Each department of the issue: a headline in the cover's face, the content
// in the reader's, and the page's folio in its bottom corners.
function Folio({ page }) {
  return (
    <div className="running-folio" aria-hidden="true">
      <span>Eljo · Issue 01</span>
      <span className="page">{page}</span>
    </div>
  )
}

export function SoundFamiliar() {
  return (
    <section className="dept dept--ink on-ink" aria-labelledby="familiar-title">
      <Folio page="04" />
      <div className="wrap">
        <div className="dept-head">
          <h2 id="familiar-title" className="display d-xl" style={{ color: 'var(--acid)' }}>
            Sound familiar?
          </h2>
          <p className="lead" style={{ color: 'var(--on-ink-2)' }}>
            Every one of these sends customers somewhere else.
          </p>
        </div>
        <ul className="letters">
          {painPoints.map(point => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function HowItWorks({ id }) {
  return (
    <section id={id} className="dept dept--acid" aria-labelledby="how-title">
      <Folio page="06" />
      <div className="wrap feature">
        <div className="feature__photo">
          <Picture
            name="laptop"
            alt="Black-and-white editorial portrait of Eljo at a laptop, lit by the screen"
            sizes="(min-width: 960px) 42vw, 100vw"
          />
        </div>
        <div>
          <h2 id="how-title" className="display d-xl">
            How it works
          </h2>
          <p className="lead" style={{ marginTop: '1.25rem' }}>
            Three steps from your first message to a site that earns.
          </p>
          <ol className="steps">
            {processSteps.map((step, i) => (
              <li key={step.title}>
                <span className="num" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

// `hideHead` is for /pricing, whose page head already says what this is: the
// list keeps its name for screen readers and drops the repeated headline.
export function PriceList({ detailed = false, hideHead = false, headingLevel = 2 }) {
  const H = `h${headingLevel}`
  return (
    <section className="dept" aria-labelledby="prices-title">
      <Folio page="08" />
      <div className="wrap">
        {hideHead ? (
          <H id="prices-title" className="sr-only">
            The price list
          </H>
        ) : (
          <div className="dept-head">
            <H id="prices-title" className="display d-xl">
              The price list
            </H>
            <p className="lead">Three sites built to bring you customers. One plan to keep yours running.</p>
          </div>
        )}
        <ul className="prices" style={hideHead ? { marginTop: 0 } : undefined}>
          {packages.map(pkg => (
            <li key={pkg.slug} className={`price ${pkg.recommended ? 'price--pick' : ''}`}>
              <div>
                <h3 className="display price__name">{pkg.name}</h3>
                {pkg.recommended && <span className="price__tag">Recommended</span>}
              </div>
              <div>
                <p className="price__for">{pkg.forWho}</p>
                {detailed && <p className="price__problem">{pkg.problem}</p>}
                {detailed && (
                  <ul className="price__includes">
                    {pkg.includes.map(item => (
                      <li key={item}>
                        <Icon name="tick" strokeWidth={2.6} />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <span className="price__note">{pkg.priceNote === '/mo' ? 'per month' : pkg.priceNote}</span>
                <span className="price__amount">{pkg.price}</span>
                <span className="price__time">{pkg.timeframe}</span>
              </div>
              <div>
                <Link to={`/contact?type=${pkg.slug}`} className={`btn ${pkg.recommended ? '' : 'btn-acid'}`}>
                  {pkg.ctaLabel}
                  <Icon name="arrowRight" className="btn-arrow" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem 2rem', justifyContent: 'space-between', marginTop: '1.75rem' }}>
          <p className="muted" style={{ fontWeight: 700, maxWidth: '60ch' }}>
            Starting prices. Your exact price is fixed in writing before work starts.
          </p>
          {!detailed && (
            <Link to="/pricing" className="text-link">
              See what's included
              <Icon name="arrowUpRight" />
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export function HoldMeToIt({ title = 'What you can hold me to' }) {
  return (
    <section className="dept dept--ink on-ink" aria-labelledby="hold-title">
      <Folio page="10" />
      <div className="wrap">
        <h2 id="hold-title" className="display d-xl" style={{ color: 'var(--acid)', maxWidth: '14ch' }}>
          {title}
        </h2>
        <ul className="holds">
          {whyMe.map(item => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Interview() {
  return (
    <section className="dept dept--paper-2" aria-labelledby="interview-title">
      <Folio page="12" />
      <div className="wrap">
        <div className="dept-head">
          <h2 id="interview-title" className="display d-xl">
            Straight answers
          </h2>
        </div>
        <dl className="interview">
          {objections.map(item => (
            <div key={item.question}>
              <dt>{item.question}</dt>
              <dd>{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export function BackCover({ title = "Let's get you more customers.", body = "Tell me about your business. I'll tell you honestly what it needs." }) {
  return (
    <section className="back-cover" aria-labelledby="back-title">
      <Picture name="posters" alt="" sizes="100vw" />
      <div className="wrap back-cover__inner">
        <h2 id="back-title" className="display">
          {title}
        </h2>
        <p>{body}</p>
        <div className="actions">
          <Link to="/contact" className="btn btn-acid btn-lg">
            {primaryCta}
            <Icon name="arrowRight" className="btn-arrow" />
          </Link>
          <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer" className="text-link" style={{ color: '#fff' }}>
            <BrandIcon name="whatsapp" />
            WhatsApp me
          </a>
        </div>
      </div>
    </section>
  )
}
