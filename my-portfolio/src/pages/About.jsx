import { Icon } from '../components/Icons'
import { Picture } from '../components/Media'
import { BackCover, HoldMeToIt } from '../components/sections/Departments'
import { methodology } from '../lib/siteConfig'

const fitFor = [
  'Founders and small businesses who need a site live in weeks, not a six-month agency retainer',
  'People who want direct access to the person actually building — no account manager relaying messages',
  'Projects with a clear goal: more leads, a working MVP, or a site that finally looks like the business behind it',
]

const notFitFor =
  'Large procurement processes or projects that need a full in-house team on-site — for those, an agency is the better call.'

export default function About() {
  return (
    <main id="main">
      <header className="page-head page-head--ink">
        <div className="page-head__media" style={{ minHeight: '28rem' }}>
          <Picture
            name="laptop"
            eager
            alt="Eljo working on a laptop on concrete steps at night, the screen lighting his face"
            sizes="(min-width: 960px) 48vw, 100vw"
            style={{ objectPosition: '50% 30%' }}
          />
        </div>
        <div className="page-head__text">
          <h1 className="display" style={{ fontSize: 'clamp(3rem, 1.5rem + 5.5vw, 6rem)' }}>
            No agency bloat. No templates. No excuses.
          </h1>
          <p className="lead" style={{ color: 'var(--on-ink-2)' }}>
            You're not hiring "a developer." You're hiring the person who builds it, talks to you directly, and has a single goal for your
            site: get you more customers.
          </p>
        </div>
      </header>

      <HoldMeToIt />

      <section className="dept dept--acid" aria-labelledby="fit-title">
        <div className="wrap dept-head" style={{ alignItems: 'start' }}>
          <h2 id="fit-title" className="display d-xl">
            Who I work best with
          </h2>
          <div>
            <ul className="holds" style={{ marginTop: 0, gridTemplateColumns: '1fr' }}>
              {fitFor.map(item => (
                <li key={item} style={{ display: 'grid', gridTemplateColumns: '1.75rem 1fr', gap: '0.75rem' }}>
                  <Icon name="tick" strokeWidth={2.8} />
                  <p style={{ marginTop: 0, fontWeight: 800, fontSize: '1.15rem', maxWidth: '50ch' }}>{item}</p>
                </li>
              ))}
            </ul>
            <div style={{ borderTop: '3px solid var(--ink)', paddingTop: '1.25rem' }}>
              <p className="label">Not the right fit</p>
              <p style={{ marginTop: '0.5rem', fontWeight: 600, maxWidth: '54ch' }}>{notFitFor}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="dept" aria-labelledby="method-title">
        <div className="wrap">
          <div className="dept-head">
            <h2 id="method-title" className="display d-xl">
              Why each step matters
            </h2>
            <p className="lead">A transformation, not a coding process. Skip a step and you get a pretty site that still doesn't sell.</p>
          </div>
          <ol className="steps" style={{ columns: 'auto' }}>
            {methodology.map((item, i) => (
              <li key={item.phase}>
                <span className="num" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h3>{item.phase}</h3>
                  <p className="muted">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <BackCover title="Ready to stop losing customers to a bad website?" body="Tell me about your business — I'll tell you honestly what it needs." />
    </main>
  )
}
