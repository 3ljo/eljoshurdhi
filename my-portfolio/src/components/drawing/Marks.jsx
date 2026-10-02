// Small drawing-set marks shared across sheets.

export function Bubble({ children, className = '' }) {
  return (
    <span className={`bubble ${className}`} aria-hidden="true">
      {children}
    </span>
  )
}

// A view title as drawn under each view: number bubble, title on a heavy
// rule, and a reference/scale note.
export function ViewTitle({ number, title, note, className = '' }) {
  return (
    <div className={`view-title ${className}`}>
      <Bubble className="bubble-solid">{number}</Bubble>
      <div>
        <span className="vt-name">{title}</span>
        {note && <span className="vt-note">{note}</span>}
      </div>
    </div>
  )
}

// Revision delta: the triangle that marks a change on a drawing.
export function Delta({ children }) {
  return (
    <svg viewBox="0 0 34 30" width="34" height="30" className="flex-none" aria-hidden="true">
      <path d="M17 2 L32 28 H2 Z" fill="none" stroke="var(--action)" strokeWidth="2" strokeLinejoin="round" />
      <text
        x="17"
        y="23"
        textAnchor="middle"
        fill="var(--action-text)"
        style={{ font: '600 11px var(--font-mono)' }}
      >
        {children}
      </text>
    </svg>
  )
}

export function TitleBlock({ cells, className = '' }) {
  return (
    <dl className={`title-block ${className}`}>
      {cells.map(cell => (
        <div key={cell.label} className={cell.className ?? ''}>
          <dt className="tb-label">{cell.label}</dt>
          <dd className="tb-value m-0">{cell.value}</dd>
        </div>
      ))}
    </dl>
  )
}
