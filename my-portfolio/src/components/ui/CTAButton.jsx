import { Link } from 'react-router-dom'
import { Icon } from '../drawing/Icons'

/**
 * The site's button. `to` renders a route link, `href` an anchor (external
 * links open in a new tab and get an outbound arrow), otherwise a <button>.
 * `variant`: primary (safety orange) | secondary (ink outline) | inverse.
 */
export default function CTAButton({
  to,
  href,
  variant = 'primary',
  size = 'md',
  arrow = false,
  className = '',
  children,
  ...rest
}) {
  const external = href?.startsWith('http')
  const classes = `btn btn-${variant} ${size === 'lg' ? 'btn-lg' : ''} ${className}`
  const content = (
    <>
      {children}
      {arrow && <Icon name="arrowRight" className="btn-arrow w-5 h-5" strokeWidth={2} />}
      {external && <Icon name="arrowUpRight" className="btn-arrow w-4 h-4" strokeWidth={2} />}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {content}
      </a>
    )
  }

  return (
    <button className={classes} {...rest}>
      {content}
    </button>
  )
}
