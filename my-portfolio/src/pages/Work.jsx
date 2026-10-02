import { caseStudies, templateStyles } from '../lib/siteConfig'
import PageHeader from '../components/sections/PageHeader'
import FinalCta from '../components/sections/FinalCta'
import { TemplateTiles } from '../components/sections/ProofSection'
import { projectSlug } from '../lib/slug'
import ProjectPlan from '../components/drawing/ProjectPlan'
import CTAButton from '../components/ui/CTAButton'
import { TitleBlock, ViewTitle } from '../components/drawing/Marks'
import { Icon } from '../components/drawing/Icons'

function CaseStudy({ project, index }) {
  const flip = index % 2 === 1
  return (
    <article id={projectSlug(project.title)} className="section rule-top scroll-mt-16" aria-labelledby={`${projectSlug(project.title)}-title`}>
      <div className="wrap grid gap-x-14 gap-y-10 lg:grid-cols-12 lg:items-start">
        <figure className={`m-0 lg:sticky lg:top-24 lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
          <ProjectPlan project={project} />
          <figcaption className="mt-5">
            <ViewTitle number={index + 1} title={`${project.title} · as built`} note="Drawing of the shipped product" />
          </figcaption>
        </figure>

        <div className={`lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}>
          <h2 id={`${projectSlug(project.title)}-title`} className="t-h2">
            {project.title}
          </h2>
          <p className="t-mono mt-3 text-ink-2">
            {project.niche} · {project.tags.join(', ')}
          </p>
          <p className="t-lead mt-6">{project.outcome}</p>

          <dl className="m-0 mt-8">
            {[
              ['The problem', project.problem],
              ['What I changed', project.role],
              ['Result', project.result],
            ].map(([label, text]) => (
              <div key={label} className="grid gap-1 border-t border-rule py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <dt className="t-mono pt-1 text-ink-2">{label}</dt>
                <dd className={`m-0 ${label === 'Result' ? 'font-semibold' : ''}`}>{text}</dd>
              </div>
            ))}
          </dl>

          <ul className="m-0 mt-2 list-none border-t border-rule p-0 pt-5">
            {project.highlights.map(h => (
              <li key={h} className="flex items-start gap-3 py-1.5">
                <Icon name="tick" className="mt-1 h-4 w-4 flex-none text-action" strokeWidth={2.25} />
                <span>{h}</span>
              </li>
            ))}
          </ul>

          <CTAButton href={project.href} size="lg" className="mt-8">
            View live site
          </CTAButton>
        </div>
      </div>
    </article>
  )
}

export default function Work() {
  return (
    <main>
      <PageHeader
        title="Case studies, not a screenshot gallery."
        lead="Every project shipped to a real, working product. Each one is drawn here as built, with the problem, what I built and the live link."
      >
        <TitleBlock
          className="grid-cols-2"
          cells={[
            { label: 'Sheet', value: 'A-101 · As-built drawings' },
            { label: 'Projects', value: `${caseStudies.length}, all live` },
            { label: 'Drawings', value: 'Illustrations of each product' },
            { label: 'Live links', value: 'Open the real sites' },
          ]}
        />
      </PageHeader>

      {caseStudies.map((project, i) => (
        <CaseStudy key={project.title} project={project} index={i} />
      ))}

      <section id="templates" className="section rule-top scroll-mt-16" aria-labelledby="templates-heading">
        <div className="wrap">
          <div className="grid gap-x-14 gap-y-6 lg:grid-cols-12">
            <h2 id="templates-heading" className="t-h2 lg:col-span-6">
              Or start from a proven layout.
            </h2>
            <p className="t-lead lg:col-span-5 lg:col-start-8 lg:self-end">
              These aren't from my portfolio — they're licensed templates I customize with your brand, copy, and content
              for a faster, lower-cost launch than a fully custom build. Good fit for the Launch package.
            </p>
          </div>
          <div className="mt-12">
            <TemplateTiles templates={templateStyles} />
          </div>
          <p className="mt-8 max-w-[60ch] text-[0.95rem] t-muted">
            Licensed templates, not original designs — layout, colors, and content get customized to your business.
            Mention a style by name when you reach out.
          </p>
        </div>
      </section>

      <FinalCta title="Want a project like these?" body="Tell me what you're building — I'll tell you honestly what it takes to ship it." />
    </main>
  )
}
