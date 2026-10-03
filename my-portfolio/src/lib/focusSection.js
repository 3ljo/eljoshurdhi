// Scrolls to an in-page section and moves keyboard focus there, so the next
// Tab continues inside the section the reader asked for.
export function focusSection(id) {
  const el = document.getElementById(id)
  if (!el) return false
  el.scrollIntoView()
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
  return true
}
