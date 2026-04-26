import { motion } from 'framer-motion'
import { useScrollAnimation, fadeUp, staggerContainer } from '../hooks/useScrollAnimation'

const projects = [
  {
    title: 'CV Climber',
    niche: 'Career SaaS',
    description: 'AI-powered resume builder that helps job seekers craft standout CVs and climb the career ladder faster.',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1600&h=900&fit=crop',
    tags: ['Next.js', 'AI', 'Tailwind', 'Stripe'],
    size: 'large',
    href: 'https://www.cvclimber.lol/',
    accent: 'from-emerald-500/30 via-emerald-900/40 to-black/90',
  },
  {
    title: 'AI Receptionist',
    niche: 'AI Automation',
    description: 'Voice AI that answers calls, books appointments, and handles customer queries 24/7 for service businesses.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=900&fit=crop',
    tags: ['Next.js', 'OpenAI', 'Twilio', 'Supabase'],
    size: 'small',
    href: 'https://ai-recepsionist-codo.vercel.app/dashboard',
    accent: 'from-violet-500/30 via-indigo-900/40 to-black/90',
  },
  {
    title: 'Nderto',
    niche: 'Construction SaaS',
    description: 'A management platform for construction crews — projects, materials, and team coordination in one dashboard.',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=900&fit=crop',
    tags: ['Next.js', 'Auth', 'Postgres', 'Tailwind'],
    size: 'small',
    href: 'https://nderto.vercel.app/login',
    accent: 'from-amber-500/30 via-orange-900/40 to-black/90',
  },
  {
    title: 'ESHB',
    niche: 'Brand & Agency',
    description: 'A modern agency landing site with bold typography, smooth scroll animations, and a clear conversion path.',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&h=900&fit=crop',
    tags: ['React', 'Framer Motion', 'Tailwind'],
    size: 'small',
    href: 'https://eshb.vercel.app/',
    accent: 'from-rose-500/30 via-pink-900/40 to-black/90',
  },
  {
    title: 'Eljo Shurdhi',
    niche: 'Personal Brand',
    description: 'Personal portfolio showcasing services, selected work, and a way for clients to get in touch.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=900&fit=crop',
    tags: ['React', 'Vite', 'Tailwind', 'Framer Motion'],
    size: 'small',
    href: 'https://eljoshurdhi.vercel.app/',
    accent: 'from-sky-500/30 via-cyan-900/40 to-black/90',
  },
]

export default function Portfolio() {
  const { ref, controls } = useScrollAnimation()

  return (
    <section id="portfolio" className="py-24 lg:py-32 bg-white dark:bg-dark-bg">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={controls}
        className="max-w-7xl mx-auto px-6"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="text-center mb-14">
          <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">Portfolio</p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Selected Work<span className="text-emerald-accent">.</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            A showcase of projects I've built — from AI tools and SaaS platforms to brand sites.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((project, i) => (
            <motion.a
              key={project.title}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeUp}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer block ${
                project.size === 'large' ? 'md:col-span-2 h-56 sm:h-80 lg:h-96' : 'h-48 sm:h-72'
              }`}
            >
              {/* Image */}
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Niche-tinted overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${project.accent} opacity-100 sm:opacity-70 sm:group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Niche badge */}
              <span className="absolute top-5 left-6 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/90 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full">
                {project.niche}
              </span>

              {/* Number */}
              <span className="absolute top-5 right-6 text-7xl font-heading font-extrabold text-white/10 leading-none select-none">
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Visit arrow — appears on hover */}
              <span className="absolute top-5 right-6 sm:right-8 sm:top-auto sm:bottom-auto sm:translate-x-0 hidden sm:flex items-center justify-center w-11 h-11 rounded-full bg-white text-gray-900 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </span>

              {/* Content — slides up on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex flex-wrap gap-2 mb-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {project.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs font-medium text-emerald-accent bg-emerald-accent/15 backdrop-blur-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 delay-75">
                  {project.description}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
