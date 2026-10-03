import eshbPlate from '../../assets/plates/story-1-image.png'
import sagePlate from '../../assets/plates/story-2-image.png'
import { Browser, Phone } from '../components/Browser'
import { Icon } from '../components/Icons'
import { LoopVideo, Picture } from '../components/Media'
import { useTurnIn } from '../lib/useTurnIn'
import { BackCover } from '../components/sections/Departments'
import { images, projectMedia, templateShots } from '../lib/media'
import { caseStudies, templateStyles } from '../lib/siteConfig'
import { projectSlug } from '../lib/slug'

const plates = { eshb: eshbPlate, sage: sagePlate }

function CaseStudy({ study }) {
  const ref = useTurnIn()
  const slug = projectSlug(study.title)
  const media = projectMedia[slug]
  const { w, h } = images[media.cover]
  // On the open spread the cover fills a viewport-tall page, so the crop
  // needs the plate's width at that height, not half the screen.
  const sizes = `(min-width: 1024px) max(50vw, calc((100vh - 3.5rem) * ${(w / h).toFixed(3)})), 100vw`
  return (
    <article id={slug} className="case" data-tone={media.tone} aria-labelledby={`${slug}-title`}>
      <div ref={ref} className="case__media">
        <Picture name={media.cover} fallback={plates[media.cover]} alt={media.coverAlt} sizes={sizes} />
        {media.video && <LoopVideo name={media.video} label={`the ${study.title} cover loop`} toggleStyle={{ right: '1rem', bottom: '1rem' }} />}
        <p className="story__title display" aria-hidden="true">
          {media.coverline.map(line => (
            <span key={line}>{line}</span>
          ))}
        </p>
      </div>
      <div className="case__body">
        <h2 id={`${slug}-title`} className="display d-lg">
          {study.title}
        </h2>
        <p className="label" style={{ marginTop: '0.6rem' }}>
          {study.niche}
        </p>
        <p className="case__deck" style={{ marginTop: '1rem' }}>
          {study.outcome}
        </p>
        <div className="case__cols">
          <div>
            <h3>The problem</h3>
            <p>{study.problem}</p>
          </div>
          <div>
            <h3>What I built</h3>
            <p>{study.role}</p>
          </div>
          <div>
            <h3>The result</h3>
            <p>{study.result}</p>
          </div>
        </div>
        <ul className="tags" aria-label="Built with">
          {study.tags.map(tag => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <div className="shots">
          <Browser
            url={media.shotUrl ?? study.href}
            shot={media.shot}
            long={media.long}
            alt={`Screenshot of the live ${study.title} site`}
            note={
              media.loginOnly
                ? 'The live app. The product sits behind sign-in, so this is its real login screen.'
                : media.long
                  ? 'The live site. Scroll inside the frame to read the whole page.'
                  : 'The live site.'
            }
          />
          <Phone shot={media.shot} alt={`${study.title} on a phone`} />
        </div>
        <div className="case__actions">
          <a
            href={study.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn ${media.tone === 'ink' ? 'btn-acid' : ''}`}
          >
            Open the live site
            <span className="sr-only">: {study.title}, opens in a new tab</span>
            <Icon name="arrowUpRight" className="btn-arrow" />
          </a>
        </div>
      </div>
    </article>
  )
}

export default function Work() {
  return (
    <main id="main">
      <header className="dept dept--acid" style={{ paddingBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
        <div className="wrap">
          <div className="dept-head">
            <h1 className="display" style={{ fontSize: 'clamp(3.5rem, 1.5rem + 8vw, 8.5rem)' }}>
              Cover stories
            </h1>
            <p className="lead">
              Six products, built and shipped, all live. Four you can click straight through; two sit behind a sign-in.
            </p>
          </div>
          <nav aria-label="Stories in this issue" style={{ marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
            <ul className="tags" style={{ marginTop: 0 }}>
              {caseStudies.map(study => (
                <li key={study.title} style={{ padding: 0, border: 0 }}>
                  <a href={`#${projectSlug(study.title)}`} className="btn btn-paper" style={{ minHeight: '2.6rem', padding: '0.5rem 1.1rem', fontSize: '0.95rem' }}>
                    {study.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {caseStudies.map(study => (
        <CaseStudy key={study.title} study={study} />
      ))}

      <section className="dept" aria-labelledby="templates-title" style={{ borderTop: '3px solid var(--ink)' }}>
        <div className="wrap">
          <div className="dept-head">
            <h2 id="templates-title" className="display d-xl">
              Licensed templates
            </h2>
            <p className="lead">
              Not my designs. Licensed starting points I customize with your brand, copy and content for a faster, lower-cost launch.
            </p>
          </div>
          <div className="templates">
            {templateStyles.map(template => (
              <a key={template.title} href={template.href} target="_blank" rel="noopener noreferrer" className="template">
                <span className="niche">{template.niche}</span>
                <h3>{template.title}</h3>
                <p>{template.description}</p>
                <div style={{ marginTop: '1rem' }}>
                  <Browser url={template.href.split('?')[0]} shot={templateShots[template.title]} alt={`Screenshot of the ${template.title} template demo`} sizes="(min-width: 1100px) 30vw, (min-width: 700px) 45vw, 100vw" />
                </div>
                <span className="text-link" style={{ marginTop: '1rem' }}>
                  View the demo
                  <Icon name="arrowUpRight" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <BackCover title="Want to be the next cover story?" />
    </main>
  )
}
