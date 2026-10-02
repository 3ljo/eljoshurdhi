import { proofChips } from '../../lib/siteConfig'
import { Icon } from '../drawing/Icons'

// The drawing's legend: the six standing promises, each with its symbol.
export default function ProofLegend({ className = '' }) {
  return (
    <ul
      className={`m-0 grid list-none grid-cols-1 gap-px overflow-hidden border-y border-rule bg-[var(--rule)] p-0 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
      aria-label="What every project includes"
    >
      {proofChips.map(chip => (
        <li key={chip.text} className="flex items-center gap-3.5 bg-paper px-1 py-4 sm:px-4">
          <span className="grid h-10 w-10 flex-none place-items-center rounded-[2px] border border-line text-line">
            <Icon name={chip.icon} className="h-5 w-5" />
          </span>
          <span className="font-medium leading-snug">{chip.text}</span>
        </li>
      ))}
    </ul>
  )
}
