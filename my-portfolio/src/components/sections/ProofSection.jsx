import { useState } from 'react'
import { Link } from 'react-router-dom'
import { caseStudies, templateStyles, templateScreenshot } from '../../lib/siteConfig'
import CTAButton from '../ui/CTAButton'
import ProjectPlan from '../drawing/ProjectPlan'
import { ViewTitle } from '../drawing/Marks'
import { Icon } from '../drawing/Icons'
import { projectSlug } from '../../lib/slug'

// A live screenshot of the template's demo. While it loads, or if the
// screenshot service is unreachable, the frame shows a hatched blank.
function TemplateShot({ template }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="hatch-diag relative aspect-[4/3] overflow-hidden rounded-[2px] border-[1.5px] border-line bg-paper-2">
      {failed ? (
        <span className="absolute inset-x-0 bottom-0 border-t border-line bg-paper px-3 py-2 text-[0.95rem] text-ink-2">
          Open the live demo to preview
        </span>
      ) : (
        <img
          src={templateScreenshot(template.href)}
          alt={`${template.title} template preview`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.03]"
        />
      )}
    </div>
  )
}

export function TemplateTiles({ templates }) {
  return (
    <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map(t => (
        <li key={t.title}>
          <a href={t.href} target="_blank" rel="noopener noreferrer" className="group block no-underline">
            <TemplateShot template={t} />
            <div className="mt-3 flex items-baseline justify-between gap-3">
              <span className="font-display text-[1.45rem] font-semibold leading-tight text-ink">{t.title}</span>
              <span className="t-mono text-ink-2">{t.niche}</span>
            </div>
            <p className="mt-1.5 text-[0.98rem] t-muted">{t.description}</p>
            <span className="link mt-2.5">
              Preview live demo
              <Icon name="arrowUpRight" className="h-4 w-4" strokeWidth={2} />
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}

export default function ProofSection() {
  const [spotlight, ...rest] = caseStudies

  return (
    <section className="section rule-top" aria-labelledby="proof-heading">
      <div className="wrap">
        <h2 id="proof-heading" className="t-h2">
          Proof, not promises.
        </h2>

        <div className="mt-12 grid gap-x-14 gap-y-10 lg:grid-cols-12 lg:items-center">
          <figure className="m-0 lg:col-span-7">
            <ProjectPlan project={spotlight} />
            <figcaption className="mt-5">
              <ViewTitle number="2" title={`${spotlight.title} · as built`} note="Drawing of the shipped storefront" />
            </figcaption>
          </figure>
          <div className="lg:col-span-5">
            <h3 className="t-h2">{spotlight.title}</h3>
            <p className="t-mono mt-3 text-ink-2">
              {spotlight.niche} · {spotlight.tags.join(', ')}
            </p>
            <p className="t-lead mt-6">{spotlight.outcome}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CTAButton href={spotlight.href} size="lg">
                View live site
              </CTAButton>
              <CTAButton to="/work" size="lg" variant="secondary">
                See all work &amp; case studies
              </CTAButton>
            </div>
          </div>
        </div>

        <ol className="m-0 mt-20 grid list-none gap-x-6 gap-y-10 p-0 sm:grid-cols-2 lg:grid-cols-5">
          {rest.map((project, i) => (
            <li key={project.title}>
              <Link to={`/work#${projectSlug(project.title)}`} className="group block no-underline" aria-label={`Read the ${project.title} case study`}>
                <ProjectPlan project={project} className="transition-transform duration-300 [transition-timing-function:var(--ease-out)] group-hover:-translate-y-1" />
                <div className="mt-4">
                  <ViewTitle number={i + 3} title={project.title} note={project.niche} />
                </div>
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-24 border-t border-rule pt-14">
          <div className="grid gap-x-14 gap-y-5 lg:grid-cols-12">
            <h3 className="t-h2 lg:col-span-6">Or start from a proven layout.</h3>
            <p className="t-lead lg:col-span-5 lg:col-start-8 lg:self-end">
              Licensed templates, not my own designs: I customize the layout, colors and content to your business for a
              faster, lower-cost launch.
            </p>
          </div>
          <div className="mt-10">
            <TemplateTiles templates={templateStyles.slice(0, 3)} />
          </div>
          <Link to="/work#templates" className="link mt-8">
            See all templates
            <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  )
}
