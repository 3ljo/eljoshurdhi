import { primaryCta } from '../../lib/siteConfig'
import CTAButton from '../ui/CTAButton'

// The close: the one field of solid safety orange on the site.
export default function FinalCta({
  title = "Let's build the website your business should have had already.",
  body = 'Tell me what you\'re building and what "done" looks like. I\'ll reply with next steps and a real quote.',
  cta = primaryCta,
}) {
  return (
    <section className="bg-action text-action-ink" aria-labelledby="cta-heading">
      <div className="wrap grid gap-10 py-[clamp(4.5rem,3.5rem+5vw,8rem)] lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <h2 id="cta-heading" className="t-h2 max-w-[18ch]">
            {title}
          </h2>
          <p className="mt-6 max-w-[40em] text-[1.2rem] font-medium leading-relaxed">
            {body}
          </p>
        </div>
        <div className="flex flex-col items-start gap-6 lg:col-span-4 lg:items-end">
          <span className="stamp stamp-on-action hidden lg:inline-block" aria-hidden="true">
            Ready to build
          </span>
          <CTAButton to="/contact" size="lg" variant="inverse" arrow>
            {cta}
          </CTAButton>
        </div>
      </div>
    </section>
  )
}
