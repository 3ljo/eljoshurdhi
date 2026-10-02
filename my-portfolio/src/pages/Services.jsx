import { packages } from '../lib/siteConfig'
import PageHeader from '../components/sections/PageHeader'
import ProofLegend from '../components/sections/ProofLegend'
import ProcessSequence from '../components/sections/ProcessSequence'
import GeneralNotes from '../components/sections/GeneralNotes'
import FinalCta from '../components/sections/FinalCta'
import CTAButton from '../components/ui/CTAButton'
import { TitleBlock } from '../components/drawing/Marks'
import { Icon } from '../components/drawing/Icons'

// One package as a specification sheet; the four sit side by side in one
// ruled set rather than as floating cards.
function PackageSheet({ pkg, index }) {
  return (
    <section
      className={`relative flex flex-col bg-paper p-6 sm:p-7 ${pkg.recommended ? 'z-[1] outline-2 outline-action [outline-style:solid]' : ''}`}
      aria-labelledby={`pkg-${pkg.slug}`}
    >
      {pkg.recommended && <span className="stamp absolute -top-4 right-5 bg-paper">Recommended</span>}
      <div className="flex items-baseline justify-between gap-3">
        <h2 id={`pkg-${pkg.slug}`} className="font-display text-[2.4rem] font-bold leading-none">
          {pkg.name}
        </h2>
        <span className="t-mono text-ink-2">P{index + 1}</span>
      </div>
      <p className="mt-3 min-h-[3.2em] font-medium leading-snug">{pkg.forWho}</p>

      <div className="mt-6 border-y border-rule py-5">
        <p className="flex items-baseline gap-2">
          <span className="t-price text-[3.25rem]">{pkg.price}</span>
          <span className="t-mono text-ink-2">{pkg.priceNote}</span>
        </p>
        <p className="mt-2 t-muted">{pkg.timeframe}</p>
      </div>

      <p className="mt-5 text-[0.98rem] t-muted">{pkg.problem}</p>

      <ul className="m-0 mt-6 flex-1 list-none space-y-3 p-0">
        {pkg.includes.map(item => (
          <li key={item} className="flex items-start gap-3 text-[0.98rem] leading-snug">
            <Icon name="tick" className="mt-0.5 h-4 w-4 flex-none text-action" strokeWidth={2.25} />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <CTAButton
        to={`/contact?type=${pkg.slug}`}
        variant={pkg.recommended ? 'primary' : 'secondary'}
        className="mt-8 w-full"
      >
        {pkg.ctaLabel}
      </CTAButton>
    </section>
  )
}

export default function Services() {
  return (
    <main>
      <PageHeader
        title="Packages built to launch, not just look good."
        lead="Four ways to work together. Every package ships a live, working site — pick the one that matches where your business is right now."
      >
        <TitleBlock
          className="grid-cols-2"
          cells={[
            { label: 'Sheet', value: 'A-201 · Package schedule' },
            { label: 'Quote', value: 'Fixed, in writing' },
            { label: 'Timeline', value: 'Confirmed before we start' },
            { label: 'Care plan', value: 'Cancel anytime' },
          ]}
        />
      </PageHeader>

      <div className="wrap">
        <div className="grid gap-px border border-rule bg-[var(--rule)] sm:grid-cols-2 xl:grid-cols-4">
          {packages.map((pkg, i) => (
            <PackageSheet key={pkg.slug} pkg={pkg} index={i} />
          ))}
        </div>
        <p className="mt-6 text-[0.95rem] t-muted">
          Prices are starting points — every project gets a fixed quote in writing before work begins.
        </p>
        <ProofLegend className="mt-14" />
      </div>

      <ProcessSequence id="process" title="Five steps, no surprises." />
      <GeneralNotes title="Common questions, answered upfront." />
      <FinalCta
        title="Not sure which package fits?"
        body="Tell me about the project — I'll tell you honestly which package fits, or if you need something custom."
        cta="Get a quote"
      />
    </main>
  )
}
