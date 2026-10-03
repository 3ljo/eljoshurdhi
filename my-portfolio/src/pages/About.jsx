import { Icon } from '../components/Icons'
import { Picture } from '../components/Media'
import { BackCover, HoldMeToIt } from '../components/sections/Departments'

const fitFor = [
  'Small businesses ready to win more customers online',
  "Owners who'd rather talk to the builder than an account manager",
  'Anyone who wants a site that finally looks like the business behind it',
]

const notFitFor = 'Big companies that need a full team on-site. An agency will suit you better.'

export default function About() {
  return (
    <main id="main">
      <header className="page-head page-head--ink">
        <div className="page-head__media" style={{ minHeight: '28rem' }}>
          <Picture
            name="laptop"
            eager
            alt="Black-and-white editorial portrait of Eljo at a laptop, lit by the screen"
            sizes="(min-width: 960px) 48vw, 100vw"
            style={{ objectPosition: '50% 30%' }}
          />
        </div>
        <div className="page-head__text">
          <h1 className="display" style={{ fontSize: 'clamp(3rem, 1.5rem + 5.5vw, 6rem)' }}>
            No middlemen. No surprise bills. No excuses.
          </h1>
          <p className="lead" style={{ color: 'var(--on-ink-2)' }}>
            One person builds your site, answers your messages, and has one goal: more customers for you.
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

      <BackCover title="Ready to stop losing customers to a bad website?" body="Tell me about your business. I'll tell you honestly what it needs." />
    </main>
  )
}
