import { brand, whyMe } from '../../lib/siteConfig'
import { useTheme } from '../../context/theme'
import { Icon } from '../drawing/Icons'

// The builder, standing in the drawing like the scale figure on an
// elevation, beside the specification the work is held to.
export function Builder({ className = '' }) {
  const { dark } = useTheme()
  const src = dark ? '/img/eljo-white-tee' : '/img/eljo-black-tee'
  return (
    <figure className={`relative m-0 ${className}`}>
      <img
        src={`${src}-960.webp`}
        srcSet={`${src}-560.webp 560w, ${src}-960.webp 960w`}
        sizes="(min-width: 1024px) 34vw, 90vw"
        width="960"
        height="960"
        alt={`${brand.name}, ${brand.role.toLowerCase()} in ${brand.location}`}
        loading="lazy"
        className="relative z-[1] mx-auto w-full max-w-[520px]"
        style={{ filter: 'drop-shadow(0 18px 24px var(--figure-shadow))' }}
      />
      <div className="relative border-t-2 border-line" aria-hidden="true">
        <div className="hatch-diag h-3" />
      </div>
      <figcaption className="mt-4 flex items-start gap-3">
        <span className="mt-2 h-px w-10 flex-none bg-line" aria-hidden="true" />
        <span>
          <span className="block font-display text-[1.35rem] font-semibold leading-tight">{brand.name}</span>
          <span className="t-muted">You talk to me, I write the code.</span>
        </span>
      </figcaption>
    </figure>
  )
}

export function WhyMeList({ className = '' }) {
  return (
    <ul className={`m-0 grid list-none gap-x-10 p-0 md:grid-cols-2 ${className}`}>
      {whyMe.map(item => (
        <li key={item.title} className="flex gap-4 border-t border-rule py-6">
          <Icon name="tick" className="mt-1 h-5 w-5 flex-none text-action" strokeWidth={2.25} />
          <div>
            <h3 className="t-h4">{item.title}</h3>
            <p className="mt-2 t-muted">{item.description}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function Specifications() {
  return (
    <section className="section rule-top" aria-labelledby="why-heading">
      <div className="wrap grid gap-x-16 gap-y-12 lg:grid-cols-12 lg:items-end">
        <Builder className="order-2 lg:order-1 lg:col-span-4" />
        <div className="order-1 lg:order-2 lg:col-span-8">
          <h2 id="why-heading" className="t-h2 max-w-[16ch]">
            No agency bloat. No templates. No excuses.
          </h2>
          <WhyMeList className="mt-12" />
        </div>
      </div>
    </section>
  )
}
