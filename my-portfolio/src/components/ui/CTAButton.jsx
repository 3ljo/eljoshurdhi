import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none'

const sizes = {
  md: 'px-6 py-3 text-sm',
  lg: 'px-7 py-4 text-[15px]',
}

const variants = {
  primary: 'bg-emerald-accent text-white hover:bg-emerald-dark',
  secondary:
    'border-2 border-gray-300 dark:border-dark-border text-gray-900 dark:text-white hover:border-emerald-accent hover:text-emerald-accent',
  ghost: 'text-gray-900 dark:text-white hover:text-emerald-accent underline underline-offset-4',
}

/**
 * Shared CTA button. Pass `to` for an internal route, `href` for an anchor
 * or external link, or neither plus `onClick`/`type="submit"` for a form
 * button.
 */
export default function CTAButton({
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  if (href) {
    const external = href.startsWith('http')
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
