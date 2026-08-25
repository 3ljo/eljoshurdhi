import { brand } from './siteConfig'

// ---------------------------------------------------------------------------
// Lead form submission — single swap-in point.
//
// Current behaviour: opens the visitor's email client, pre-addressed and
// pre-filled to brand.leadEmail. It works with zero setup, but it is an
// interim measure — the visitor still has to hit "send" in their own mail
// app. Every field below is still captured and validated in <Contact />;
// only the delivery step is a placeholder.
//
// To upgrade later: replace the body of `submitLead` with a `fetch()` call
// to Formspree / EmailJS / a Resend-backed API route, and stop calling
// `window.location.href`. Nothing else in the app needs to change.
// ---------------------------------------------------------------------------

export function validateLead(fields) {
  const errors = {}

  if (!fields.name?.trim()) errors.name = 'Enter your name.'

  if (!fields.email?.trim()) {
    errors.email = 'Enter your email.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!fields.projectType) errors.projectType = 'Choose a project type.'
  if (!fields.budget) errors.budget = 'Choose a budget range.'

  if (!fields.message?.trim()) {
    errors.message = 'Tell me a bit about the project.'
  } else if (fields.message.trim().length < 10) {
    errors.message = 'A few more details would help — one or two sentences is plenty.'
  }

  return errors
}

export async function submitLead(fields, { projectTypeLabel, budgetLabel } = {}) {
  const subject = `New project inquiry from ${fields.name}`
  const body = [
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    `Project type: ${projectTypeLabel ?? fields.projectType}`,
    `Budget range: ${budgetLabel ?? fields.budget}`,
    '',
    fields.message,
  ].join('\n')

  const href = `mailto:${brand.leadEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.location.href = href

  // Simulated latency so the UI can show a real "sending" state even though
  // the mail client opens near-instantly.
  await new Promise(resolve => setTimeout(resolve, 500))
  return { ok: true }
}
