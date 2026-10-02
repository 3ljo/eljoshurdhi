import { Link } from 'react-router-dom'
import { packages } from '../../lib/siteConfig'
import { Icon } from '../drawing/Icons'

// Packages as a schedule, the table a drawing set uses to list its parts.
export default function PackageSchedule() {
  return (
    <>
      <table className="schedule hidden md:table">
        <thead>
          <tr>
            <th scope="col" className="w-[7%]">Mark</th>
            <th scope="col" className="w-[22%]">Package</th>
            <th scope="col">Who it's for</th>
            <th scope="col" className="w-[16%]">Timeframe</th>
            <th scope="col" className="w-[13%] text-right">Price</th>
            <th scope="col" className="w-[13%]">
              <span className="sr-only">Action</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg, i) => (
            <tr key={pkg.slug}>
              <td className="t-figure text-ink-2">P{i + 1}</td>
              <th scope="row">
                <span className="block font-display text-[1.75rem] font-bold leading-none">{pkg.name}</span>
                {pkg.recommended && <span className="stamp mt-2.5">Recommended</span>}
              </th>
              <td className="text-[1.05rem] leading-snug">{pkg.forWho}</td>
              <td className="t-muted">{pkg.timeframe}</td>
              <td className="text-right">
                <span className="t-price block text-[2rem]">{pkg.price}</span>
                <span className="t-mono mt-1.5 block text-[0.6875rem] text-ink-2">{pkg.priceNote}</span>
              </td>
              <td className="text-right">
                <Link to={`/contact?type=${pkg.slug}`} className="link whitespace-nowrap">
                  {pkg.ctaLabel}
                  <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="m-0 list-none border-t-2 border-ink p-0 md:hidden">
        {packages.map((pkg, i) => (
          <li key={pkg.slug} className="border-b border-rule py-5">
            <div className="flex items-start justify-between gap-4">
              <p className="flex items-baseline gap-3">
                <span className="t-mono text-ink-2">P{i + 1}</span>
                <span className="font-display text-[1.75rem] font-bold leading-none">{pkg.name}</span>
              </p>
              <div className="text-right">
                <span className="t-price block text-[1.9rem]">{pkg.price}</span>
                <span className="t-mono mt-1 block text-[0.6875rem] text-ink-2">{pkg.priceNote}</span>
              </div>
            </div>
            {pkg.recommended && <span className="stamp mt-3">Recommended</span>}
            <p className="mt-3 leading-snug">{pkg.forWho}</p>
            <p className="mt-1 t-muted">{pkg.timeframe}</p>
            <Link to={`/contact?type=${pkg.slug}`} className="link mt-3">
              {pkg.ctaLabel}
              <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2} />
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
