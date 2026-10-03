import { Link } from 'react-router-dom'
import eshbPlate from '../../../assets/plates/story-1-image.png'
import sagePlate from '../../../assets/plates/story-2-image.png'
import { caseStudies } from '../../lib/siteConfig'
import { projectMedia } from '../../lib/media'
import { projectSlug } from '../../lib/slug'
import { useTurnIn } from '../../lib/useTurnIn'
import { Icon } from '../Icons'
import { LoopVideo, Picture } from '../Media'

const plates = { eshb: eshbPlate, sage: sagePlate }
// Where each lead plate sits in its wide card, so the frame the comp
// approved is the frame you see.
const leadFocus = { eshb: '50% 76%', sage: '50% 100%' }

// A cover story: one link stretched over the whole card, named by its cover
// line and project, with the video's pause control kept outside the link.
function Story({ study, lead = false, index = 0 }) {
  const ref = useTurnIn()
  const slug = projectSlug(study.title)
  const media = projectMedia[slug]
  return (
    <article
      ref={ref}
      className={`story ${lead ? 'story--lead' : ''}`}
      data-tone={media.tone}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div className="story__media">
        <Picture
          name={media.cover}
          fallback={plates[media.cover]}
          alt=""
          sizes={lead ? '(min-width: 1024px) 47vw, 100vw' : '(min-width: 1280px) 24vw, (min-width: 700px) 50vw, 100vw'}
          style={lead ? { objectPosition: leadFocus[media.cover] } : undefined}
        />
        {media.video && <LoopVideo name={media.video} label={`the ${study.title} cover loop`} toggleStyle={{ right: '0.75rem', bottom: '0.75rem' }} />}
        <p id={`${slug}-cover`} className="story__title display" aria-hidden="true">
          {media.coverline.map(line => (
            <span key={line}>{line}</span>
          ))}
        </p>
      </div>
      <div className="story__meta">
        <h3 className="label niche">
          <Link to={`/work#${slug}`} className="story__link" aria-labelledby={`${slug}-cover ${slug}-name`}>
            <span id={`${slug}-name`}>
              <span className="nowrap">{study.title}</span> <span className="niche-sep">·</span>{' '}
              <span className="nowrap">{study.niche}</span>
            </span>
          </Link>
        </h3>
        <span className="story__go" aria-hidden="true">
          Before & after
          <Icon name="arrowRight" />
        </span>
        <p>{study.outcome}</p>
      </div>
    </article>
  )
}

// The work, as cover stories: the two lead features from the approved cover,
// then the rest of the issue.
export default function CoverStories() {
  const bySlug = Object.fromEntries(caseStudies.map(s => [projectSlug(s.title), s]))
  const lead = [bySlug.eshb, bySlug['sage-commerce']]
  const more = ['cv-climber', 'ai-receptionist', 'nderto', 'denaro'].map(slug => bySlug[slug])

  return (
    <section className="stories" aria-labelledby="stories-title">
      <div className="stories__head">
        <h2 id="stories-title" className="display stories__title">
          Proof, not promises
        </h2>
      </div>
      <div className="stories__lead">
        {lead.map((study, i) => (
          <Story key={study.title} study={study} lead index={i} />
        ))}
      </div>
      <div className="stories__more">
        {more.map((study, i) => (
          <Story key={study.title} study={study} index={i} />
        ))}
      </div>
      <div className="stories__foot">
        <Link to="/work" className="text-link">
          See them all live
          <Icon name="arrowUpRight" />
        </Link>
      </div>
    </section>
  )
}
