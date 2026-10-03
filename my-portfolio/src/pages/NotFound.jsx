import { Link } from 'react-router-dom'
import { Icon } from '../components/Icons'
import { Picture } from '../components/Media'

export default function NotFound() {
  return (
    <main id="main" className="notfound on-ink">
      <meta name="robots" content="noindex" />
      <Picture name="posters" alt="" sizes="100vw" />
      <div className="wrap" style={{ paddingBlock: 'clamp(4rem, 8vw, 7rem)' }}>
        <h1 className="display" style={{ fontSize: 'clamp(3.25rem, 1.5rem + 7vw, 8rem)', maxWidth: '12ch' }}>
          This page doesn't exist.
        </h1>
        <p className="lead" style={{ marginTop: '1.25rem' }}>
          Old or mistyped link. Everything else is still here.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem 1.75rem', alignItems: 'center', marginTop: '2rem' }}>
          <Link to="/" className="btn btn-acid btn-lg">
            Go to the home page
            <Icon name="arrowRight" className="btn-arrow" />
          </Link>
          <Link to="/work" className="text-link" style={{ color: '#fff' }}>
            See the work
          </Link>
        </div>
      </div>
    </main>
  )
}
