import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold transition-colors duration-200 disabled:opacity-60 disabled:pointer-events-none'

const sizes = {
  md: 'px-6 py-3 text-sm',
  lg: 'px-7 py-4 text-[15px]',
}

const variants = {
  primary: 'bg-signal dark:bg-signal-dark text-signal-ink hover:brightness-95',
  secondary:
    'border-2 border-ink/15 dark:border-white/15 text-ink dark:text-ink-dark hover:border-signal hover:text-signal dark:hover:border-signal-dark dark:hover:text-signal-dark',
  ghost: 'text-ink dark:text-ink-dark hover:text-signal dark:hover:text-signal-dark underline underline-offset-4',
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
