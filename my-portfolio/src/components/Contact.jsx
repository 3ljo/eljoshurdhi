import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { useScrollAnimation, fadeUp, slideLeft, slideRight, staggerContainer } from '../hooks/useScrollAnimation'
import { Globe3D } from './ui/3d-globe'

const globeMarkers = [
  { lat: 41.3275, lng: 19.8187, src: "https://assets.aceternity.com/avatars/1.webp", label: "Albania" },
  { lat: 40.7128, lng: -74.006, src: "https://assets.aceternity.com/avatars/2.webp", label: "New York" },
  { lat: 51.5074, lng: -0.1278, src: "https://assets.aceternity.com/avatars/3.webp", label: "London" },
  { lat: 35.6762, lng: 139.6503, src: "https://assets.aceternity.com/avatars/4.webp", label: "Tokyo" },
  { lat: 48.8566, lng: 2.3522, src: "https://assets.aceternity.com/avatars/5.webp", label: "Paris" },
  { lat: 55.7558, lng: 37.6173, src: "https://assets.aceternity.com/avatars/6.webp", label: "Moscow" },
  { lat: -33.8688, lng: 151.2093, src: "https://assets.aceternity.com/avatars/7.webp", label: "Sydney" },
  { lat: 1.3521, lng: 103.8198, src: "https://assets.aceternity.com/avatars/8.webp", label: "Singapore" },
  { lat: 25.2048, lng: 55.2708, src: "https://assets.aceternity.com/avatars/9.webp", label: "Dubai" },
]

export default function Contact() {
  const { ref, controls } = useScrollAnimation()
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    try {
      await emailjs.sendForm(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        formRef.current,
        'YOUR_PUBLIC_KEY'
      )
    } catch {
      // silent fail
    }
    setStatus('success')
    formRef.current.reset()
    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <section id="contact" className="py-24 lg:py-32 bg-white dark:bg-dark-bg">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={controls}
        className="max-w-7xl mx-auto px-6"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="text-center mb-16">
          <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">Contact</p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Let's Work Together<span className="text-emerald-accent">.</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Have a project in mind or just want to connect? Drop me a message and I'll get back to you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Globe */}
          <motion.div variants={slideLeft}>
            <Globe3D
              markers={globeMarkers}
              className="h-[280px] sm:h-[400px] lg:h-[500px]"
              config={{
                atmosphereColor: "#10B981",
                atmosphereIntensity: 0.6,
                showAtmosphere: true,
                atmosphereBlur: 3,
                bumpScale: 5,
                autoRotateSpeed: 0.3,
              }}
            />
            {/* Contact Links */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-4">
              <a href="mailto:shurdhieljo@outlook.com" className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-accent transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                shurdhieljo@outlook.com
              </a>
              <a href="https://wa.me/355682080411" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-accent transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                +355 682 080 411
              </a>
              <a href="https://www.linkedin.com/in/eljo-shurdhi-6580111bb/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-accent transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
              <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Albania
              </span>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div variants={slideRight}>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="relative">
                  <input
                    type="text"
                    name="user_name"
                    required
                    placeholder=" "
                    className="peer w-full px-4 pt-6 pb-2 rounded-xl bg-transparent border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white focus:outline-none focus:border-emerald-accent transition-colors"
                  />
                  <label className="absolute left-4 top-2 text-[11px] font-medium uppercase tracking-wider text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-emerald-accent transition-all pointer-events-none">
                    Name
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    name="user_email"
                    required
                    placeholder=" "
                    className="peer w-full px-4 pt-6 pb-2 rounded-xl bg-transparent border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white focus:outline-none focus:border-emerald-accent transition-colors"
                  />
                  <label className="absolute left-4 top-2 text-[11px] font-medium uppercase tracking-wider text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-emerald-accent transition-all pointer-events-none">
                    Email
                  </label>
                </div>
              </div>
              <div className="relative">
                <textarea
                  name="message"
                  required
                  rows={6}
                  placeholder=" "
                  className="peer w-full px-4 pt-6 pb-2 rounded-xl bg-transparent border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white focus:outline-none focus:border-emerald-accent transition-colors resize-none"
                />
                <label className="absolute left-4 top-2 text-[11px] font-medium uppercase tracking-wider text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-emerald-accent transition-all pointer-events-none">
                  Message
                </label>
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="group relative w-full py-4 rounded-full font-semibold text-white overflow-hidden transition-all duration-500"
              >
                <span className={`absolute inset-0 transition-all duration-500 ${
                  status === 'success'
                    ? 'bg-emerald-accent'
                    : 'bg-gradient-to-r from-emerald-accent to-emerald-dark group-hover:from-emerald-dark group-hover:to-emerald-accent'
                }`} />
                <span className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  status === 'success' ? '' : 'shadow-[inset_0_0_20px_rgba(255,255,255,0.15)]'
                }`} />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {status === 'sending' && (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  )}
                  {status === 'success' && (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Message Sent!
                    </>
                  )}
                  {status === 'idle' && (
                    <>
                      Send Message
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
