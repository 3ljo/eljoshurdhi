import { useInView } from '../../hooks/useInView'

// Wraps a drawing so its linework plots itself, then its fills build in,
// once it scrolls into view (see `.plot` in index.css).
export default function Plot({ as = 'div', className = '', children, ...rest }) {
  const Tag = as
  const [ref, inView] = useInView()
  return (
    <Tag ref={ref} className={`plot ${inView ? 'in-view' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
