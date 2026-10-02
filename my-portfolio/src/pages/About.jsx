import PageHeader from '../components/sections/PageHeader'
import ProofLegend from '../components/sections/ProofLegend'
import FinalCta from '../components/sections/FinalCta'
import { Builder, WhyMeList } from '../components/sections/Specifications'
import { Icon } from '../components/drawing/Icons'

const fitFor = [
  'Founders and small businesses who need a site live in weeks, not a six-month agency retainer',
  'People who want direct access to the person actually building — no account manager relaying messages',
  'Projects with a clear goal: more leads, a working MVP, or a site that finally looks like the business behind it',
]

const notFitFor =
  'Large procurement processes or projects that need a full in-house team on-site — for those, an agency is the better call.'

export default function About() {
  return (
    <main>
      <PageHeader
        title="No agency bloat. No templates. No excuses."
        lead={`You're not hiring "a developer." You're hiring the person who builds it, talks to you directly, and has a single goal for your site: get you more customers.`}
      >
        <Builder className="mx-auto max-w-[420px] lg:max-w-none" />
      </PageHeader>

      <div className="wrap">
        <ProofLegend />
      </div>

      <section className="section" aria-labelledby="spec-heading">
        <div className="wrap">
          <h2 id="spec-heading" className="t-h2 max-w-[18ch]">
            What you can hold me to.
          </h2>
          <WhyMeList className="mt-10" />
        </div>
      </section>

      <section className="section rule-top" aria-labelledby="fit-heading">
        <div className="wrap grid gap-x-14 gap-y-10 lg:grid-cols-12">
          <h2 id="fit-heading" className="t-h2 lg:col-span-5">
            Who I work best with.
          </h2>
          <div className="lg:col-span-7">
            <ul className="m-0 list-none p-0">
              {fitFor.map(item => (
                <li key={item} className="flex items-start gap-4 border-t border-rule py-5 text-[1.1rem] leading-snug">
                  <Icon name="tick" className="mt-1 h-5 w-5 flex-none text-action" strokeWidth={2.25} />
                  {item}
                </li>
              ))}
            </ul>
            <div className="grid gap-1 border-t-2 border-ink pt-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <p className="t-mono pt-1 text-ink-2">Not the right fit</p>
              <p className="t-muted">{notFitFor}</p>
            </div>
          </div>
        </div>
      </section>

      <FinalCta
        title="Ready to stop losing customers to a bad website?"
        body="Tell me about your business — I'll tell you honestly what it needs."
      />
    </main>
  )
}
