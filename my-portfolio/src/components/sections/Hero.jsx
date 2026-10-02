import { brand, primaryCta } from '../../lib/siteConfig'
import CTAButton from '../ui/CTAButton'
import PlanHero from '../drawing/PlanHero'
import { heroKeynotes } from '../drawing/heroKeynotes'
import { Bubble, ViewTitle } from '../drawing/Marks'

// The professional seal an architect stamps on a drawing set: here, a
// portrait ringed with the builder's name.
export function Seal({ size = 104 }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className="flex-none" role="img" aria-label={`${brand.name}, seal`}>
      <defs>
        <clipPath id="seal-clip">
          <circle cx="60" cy="60" r="38" />
        </clipPath>
        <path id="seal-ring" d="M60 60 m-49 0 a49 49 0 1 1 98 0 a49 49 0 1 1 -98 0" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="var(--paper)" stroke="var(--line)" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="40.5" fill="none" stroke="var(--line)" strokeWidth="1" />
      <image href="/img/eljo-portrait-560.webp" x="16" y="18" width="88" height="88" clipPath="url(#seal-clip)" preserveAspectRatio="xMidYMin slice" />
      <text style={{ font: '600 9.5px var(--font-mono)', letterSpacing: '0.18em' }} fill="var(--line)">
        <textPath href="#seal-ring" startOffset="2%">
          ELJO SHURDHI · DESIGNS &amp; BUILDS · TIRANA ·
        </textPath>
      </text>
    </svg>
  )
}

export default function Hero() {
  return (
    <section className="pt-[calc(68px+env(safe-area-inset-top,0px))]">
      <div className="wrap grid items-center gap-x-14 gap-y-12 pt-12 pb-14 lg:grid-cols-12 lg:pt-16 lg:pb-16">
        <div className="lg:col-span-5">
          <h1 className="t-display">Stop losing customers to businesses with better websites.</h1>
          <p className="t-lead mt-7">
            If your site looks outdated, loads slow, or doesn't make your offer obvious in five seconds, you're handing
            customers to whoever looks better on Google. I build fast, modern websites that make your business look as
            good as it actually is — and turn visitors into inquiries.
          </p>
          <div className="mt-9 grid gap-3 sm:flex sm:flex-wrap">
            <CTAButton to="/contact" size="lg" arrow>
              {primaryCta}
            </CTAButton>
            <CTAButton to="/work" size="lg" variant="secondary">
              See the work
            </CTAButton>
          </div>
          <p className="mt-5 text-[0.98rem] t-muted">
            No obligation. Tell me about your business, I'll tell you honestly if I can help.
          </p>
        </div>

        <figure className="m-0 lg:col-span-7">
          <PlanHero />
          <figcaption className="mt-6 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-start">
            <ViewTitle number="1" title="Proposed homepage" note="A-001 · Not to scale" />
            <ol className="m-0 grid list-none gap-x-6 gap-y-2.5 p-0 sm:grid-cols-2 sm:pl-6">
              {heroKeynotes.map(k => (
                <li key={k.n} className="flex items-center gap-3 text-[0.98rem] leading-snug text-balance">
                  <Bubble>{k.n}</Bubble>
                  {k.text}
                </li>
              ))}
            </ol>
          </figcaption>
        </figure>
      </div>

      <div className="wrap">
        <dl className="title-block m-0 grid-cols-2 md:grid-cols-[auto_1fr_1fr_1fr_1fr]">
          <div className="col-span-2 flex items-center gap-4 md:col-span-1 md:row-span-1 md:border-r md:border-r-[var(--line-soft)]">
            <Seal size={92} />
            <div>
              <dt className="tb-label">Designed &amp; built by</dt>
              <dd className="tb-value m-0">{brand.name}</dd>
            </div>
          </div>
          <div className="border-r border-r-[var(--line-soft)]">
            <dt className="tb-label">Project</dt>
            <dd className="tb-value m-0">Your business website</dd>
          </div>
          <div className="md:border-r md:border-r-[var(--line-soft)]">
            <dt className="tb-label">Price</dt>
            <dd className="tb-value m-0">Fixed, in writing, before we start</dd>
          </div>
          <div className="border-r border-r-[var(--line-soft)]">
            <dt className="tb-label">Contact</dt>
            <dd className="tb-value m-0">Straight to the person building it</dd>
          </div>
          <div>
            <dt className="tb-label">Location</dt>
            <dd className="tb-value m-0">{brand.location}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
