import { useEffect, useId, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useSearchParams } from 'react-router-dom'
import { BrandIcon, Icon } from '../components/Icons'
import { validateLead, submitLead } from '../lib/leadForm'
import { brand, budgetOptions, projectTypeOptions } from '../lib/siteConfig'

function TextField({ label, error, multiline = false, ...props }) {
  const id = useId()
  const Tag = multiline ? 'textarea' : 'input'
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <Tag
        id={id}
        className="field"
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  )
}

function ChoiceField({ legend, name, options, value, onChange, error }) {
  const id = useId()
  return (
    <fieldset style={{ margin: 0, padding: 0, border: 0 }} aria-invalid={error ? 'true' : undefined}>
      <legend className="field-label" style={{ padding: 0 }}>
        {legend}
      </legend>
      <div className="choices">
        {options.map(option => (
          <label key={option.value} className="choice">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={error ? `${id}-error` : undefined}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
    </fieldset>
  )
}

export default function Contact() {
  const [searchParams] = useSearchParams()
  const formRef = useRef(null)
  const resetTimer = useRef(null)
  const [status, setStatus] = useState('idle') // idle | sending | handed-off
  const [errors, setErrors] = useState({})
  const [fields, setFields] = useState({
    name: '',
    email: '',
    projectType: projectTypeOptions.some(o => o.value === searchParams.get('type')) ? searchParams.get('type') : '',
    budget: '',
    message: '',
  })

  useEffect(() => () => clearTimeout(resetTimer.current), [])

  // A field that is fixed stops reporting its error straight away.
  const update = key => e => {
    const { value } = e.target
    setFields(prev => ({ ...prev, [key]: value }))
    setErrors(prev => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const validationErrors = validateLead(fields)
    // Render the errors before moving focus, so the field is announced with
    // its error rather than without it.
    flushSync(() => setErrors(validationErrors))
    // Errors render on the next paint, so find the first invalid field by
    // name (in form order) rather than by its aria-invalid attribute.
    const firstInvalid = Object.keys(fields).find(key => validationErrors[key])
    if (firstInvalid) {
      formRef.current?.querySelector(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    setStatus('sending')
    const projectTypeLabel = projectTypeOptions.find(o => o.value === fields.projectType)?.label
    const budgetLabel = budgetOptions.find(o => o.value === fields.budget)?.label
    await submitLead(fields, { projectTypeLabel, budgetLabel })

    // The page can't tell whether an email app opened, so the details stay
    // in the form and the message says what to do if nothing happened.
    setStatus('handed-off')
    clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setStatus('idle'), 20000)
  }

  return (
    <main id="main" className="reply">
      <section className="reply__side on-ink" aria-labelledby="contact-title">
        <h1 id="contact-title" className="display" style={{ fontSize: 'clamp(3.25rem, 1.5rem + 6vw, 7rem)' }}>
          Tell me about your business.
        </h1>
        <p className="lead" style={{ color: 'var(--on-ink-2)' }}>
          I read every message myself and reply with an honest take on what your business needs.
        </p>
        <div>
          <p className="label" style={{ color: 'var(--on-ink-2)', marginBottom: '0.5rem' }}>
            Prefer a direct line?
          </p>
          <ul className="reply__lines">
            <li>
              <a href={`mailto:${brand.directEmail}`}>
                <span>
                  <Icon name="mail" />
                  {brand.directEmail}
                </span>
                <Icon name="arrowUpRight" />
              </a>
            </li>
            <li>
              <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer">
                <span>
                  <BrandIcon name="whatsapp" />
                  <span>
                    WhatsApp <span className="nowrap">{brand.whatsappLabel}</span>
                  </span>
                </span>
                <Icon name="arrowUpRight" />
              </a>
            </li>
            <li>
              <a href={brand.linkedin} target="_blank" rel="noopener noreferrer">
                <span>
                  <BrandIcon name="linkedin" />
                  LinkedIn
                </span>
                <Icon name="arrowUpRight" />
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="reply__card" aria-labelledby="form-title">
        <form ref={formRef} onSubmit={handleSubmit} noValidate className="reply__form" aria-labelledby="form-title">
          <h2 id="form-title" className="display d-md">
            Start your project
          </h2>
          <p style={{ marginTop: '0.5rem', fontWeight: 700, maxWidth: '48ch' }}>
            Two minutes. Press send and your email app opens with it all filled in.
          </p>
          <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1.75rem' }}>
            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))' }}>
              <TextField label="Name" name="name" autoComplete="name" value={fields.name} onChange={update('name')} error={errors.name} />
              <TextField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                value={fields.email}
                onChange={update('email')}
                error={errors.email}
              />
            </div>
            <ChoiceField
              legend="What do you need?"
              name="projectType"
              options={projectTypeOptions}
              value={fields.projectType}
              onChange={update('projectType')}
              error={errors.projectType}
            />
            <ChoiceField
              legend="Budget"
              name="budget"
              options={budgetOptions}
              value={fields.budget}
              onChange={update('budget')}
              error={errors.budget}
            />
            <TextField
              label="About your business"
              name="message"
              multiline
              rows={6}
              placeholder="What do you sell, and what do you want more of: calls, bookings, sales?"
              value={fields.message}
              onChange={update('message')}
              error={errors.message}
            />
          </div>

          <button type="submit" className="btn btn-lg" style={{ width: '100%', marginTop: '2rem', whiteSpace: 'normal' }} disabled={status === 'sending'}>
            {status === 'sending' ? 'Opening your email…' : 'Send My Details'}
            {status !== 'sending' && <Icon name="arrowRight" className="btn-arrow" />}
          </button>
          <p style={{ marginTop: '0.9rem', textAlign: 'center', fontWeight: 600, fontSize: '0.95rem' }} aria-live="polite">
            {status === 'handed-off' ? (
              <>
                Your email app should open with all of this filled in. Nothing opened? Email{' '}
                <a href={`mailto:${brand.directEmail}`} style={{ fontWeight: 800 }}>
                  {brand.directEmail}
                </a>{' '}
                or{' '}
                <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 800 }}>
                  WhatsApp me
                </a>
                . Your details are still here.
              </>
            ) : null}
          </p>
        </form>
      </section>
    </main>
  )
}
