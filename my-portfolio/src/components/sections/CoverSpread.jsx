import { Link } from 'react-router-dom'
import portraitPlate from '../../../assets/plates/portrait.png'
import { primaryCta } from '../../lib/siteConfig'
import { Icon } from '../Icons'
import { LoopVideo, Picture } from '../Media'

// Each promise as printed on the cover, line by line.
const promises = [['Fixed price, in writing,', 'before we start'], ['A direct line to the person', 'building it'], ['Live in weeks, not months']]

// The cover: an open spread. Left page, the cover star; right page, the
// promise, three numbered points and the way in. Folio 02.
export default function CoverSpread() {
  return (
    <section className="spread" aria-labelledby="cover-title">
      <div className="cover-left">
        <Picture
          name="portrait"
          fallback={portraitPlate}
          eager
          sizes="(min-width: 1024px) 50vw, 100vw"
          alt="Eljo Shurdhi in a black t-shirt, arms crossed, in front of a graffiti wall"
        />
        <LoopVideo name="portrait" label="the moving portrait" toggleStyle={{ left: '1rem', bottom: '1rem' }} />
        <p className="masthead" aria-hidden="true">
          <span>Eljo</span>
        </p>
      </div>

      <div className="cover-right">
        <h1 id="cover-title" className="cover-title">
          <span className="line">
            <span>Stop losing</span>
          </span>{' '}
          <span className="line">
            <span>customers to</span>
          </span>{' '}
          <span className="line">
            <span>businesses with</span>
          </span>{' '}
          <span className="line">
            <span>better websites.</span>
          </span>
        </h1>

        <ol className="promises">
          {promises.map((promise, i) => (
            <li key={promise[0]}>
              <span className="num" aria-hidden="true">
                {i + 1}
              </span>
              <span className="txt">
                {promise.map((line, j) => (
                  <span key={line}>
                    {j > 0 && ' '}
                    {line}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ol>

        <div className="cover-actions">
          <Link to="/contact" className="btn btn-block cover-cta">
            {primaryCta}
            <Icon name="arrowRight" className="btn-arrow" strokeWidth={2.4} />
          </Link>
          <Link to="/work" className="text-link cover-secondary">
            See the work
          </Link>
        </div>

        <span className="folio" aria-hidden="true">
          02
        </span>
      </div>
    </section>
  )
}
