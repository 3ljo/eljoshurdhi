import { motion } from 'framer-motion'
import { useScrollAnimation, fadeUp, staggerContainer } from '../hooks/useScrollAnimation'

const projects = [
  {
    title: 'E-Commerce Platform',
    description: 'Full-stack shopping platform with cart, auth, and payment integration.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    tags: ['React', 'Node.js', 'MongoDB'],
    size: 'large',
  },
  {
    title: 'Task Management App',
    description: 'Drag-and-drop project board with real-time updates.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
    tags: ['React', 'Firebase', 'Tailwind'],
    size: 'small',
  },
  {
    title: 'AI Business Automation',
    description: 'AI-powered workflows and predictive analytics for businesses.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
    tags: ['Python', 'OpenAI', 'React'],
    size: 'small',
  },
  {
    title: 'Brand Identity System',
    description: 'Complete branding package with logo, typography, and color system.',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop',
    tags: ['Figma', 'Illustrator'],
    size: 'small',
  },
  {
    title: 'Portfolio Dashboard',
    description: 'Analytics dashboard with charts, filters, and data export.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    tags: ['Next.js', 'TypeScript', 'Chart.js'],
    size: 'small',
  },
  {
    title: 'CLI Automation Tool',
    description: 'Command-line utility for automating deployment workflows.',
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=600&fit=crop',
    tags: ['Node.js', 'Bash', 'Docker'],
    size: 'large',
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
            A showcase of projects I've built — from full-stack apps to design systems.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              variants={fadeUp}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer ${
                project.size === 'large' ? 'md:col-span-2 h-72 sm:h-80 lg:h-96' : 'h-64 sm:h-72'
              }`}
            >
              {/* Image */}
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Overlay — visible on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Number */}
              <span className="absolute top-5 right-6 text-7xl font-heading font-extrabold text-white/10 leading-none select-none">
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Content — slides up on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex flex-wrap gap-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
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
                <p className="text-gray-300 text-sm leading-relaxed max-w-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
