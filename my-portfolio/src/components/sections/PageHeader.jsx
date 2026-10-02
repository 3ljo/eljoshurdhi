// The top of an inner sheet: the title and lead on the left, the sheet's own
// title block or figure on the right.
export default function PageHeader({ title, lead, children }) {
  return (
    <header className="pt-[calc(68px+env(safe-area-inset-top,0px))]">
      <div className="wrap grid gap-x-14 gap-y-10 pt-14 pb-14 lg:grid-cols-12 lg:items-end lg:pt-20 lg:pb-20">
        <div className="lg:col-span-7">
          <h1 className="t-display">{title}</h1>
          {lead && <p className="t-lead mt-7">{lead}</p>}
        </div>
        {children && <div className="lg:col-span-5">{children}</div>}
      </div>
    </header>
  )
}
