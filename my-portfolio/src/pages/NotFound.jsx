import { Link } from 'react-router-dom'
import { Icon } from '../components/Icons'
import { Picture } from '../components/Media'

export default function NotFound() {
  return (
    <main id="main" className="notfound on-ink">
      <Picture name="posters" alt="" sizes="100vw" />
      <div className="wrap" style={{ paddingBlock: 'clamp(4rem, 8vw, 7rem)' }}>
        <h1 className="display" style={{ fontSize: 'clamp(3.25rem, 1.5rem + 7vw, 8rem)', maxWidth: '12ch' }}>
          This page isn't in the issue.
        </h1>
        <p className="lead" style={{ marginTop: '1.25rem' }}>
          The link may be old or mistyped. The cover and the stories are still here.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem 1.75rem', alignItems: 'center', marginTop: '2rem' }}>
          <Link to="/" className="btn btn-acid btn-lg">
            Back to the cover
            <Icon name="arrowRight" className="btn-arrow" />
          </Link>
          <Link to="/work" className="text-link" style={{ color: '#fff' }}>
            Read the cover stories
          </Link>
        </div>
      </div>
    </main>
  )
}
