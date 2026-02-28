import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ExternalLink, Github, ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeProject, setActiveProject] = useState<number | null>(null)
  const scrollTriggerInstance = useRef<ScrollTrigger | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current
      if (track) {
        const scrollWidth = track.scrollWidth - window.innerWidth + 100

        // Horizontal scroll animation - EXACTLY as original
        const tween = gsap.to(track, {
          x: -scrollWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${scrollWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          }
        })

        scrollTriggerInstance.current = tween.scrollTrigger as ScrollTrigger

        // Card skew based on scroll velocity - EXACTLY as original
        const cards = track.querySelectorAll('.project-card')
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${scrollWidth}`,
          onUpdate: (self) => {
            const velocity = self.getVelocity()
            const skewAmount = Math.min(Math.max(velocity / 500, -5), 5)
            gsap.to(cards, {
              skewX: skewAmount,
              duration: 0.3,
              ease: 'power2.out'
            })
          }
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Mouse position detection for dead zone
  useEffect(() => {
    const section = sectionRef.current
    if (!section || !scrollTriggerInstance.current) return

    const handleMouseMove = (e: MouseEvent) => {
      // Only on desktop (lg breakpoint and up)
      if (window.innerWidth < 1024) {
        scrollTriggerInstance.current?.enable()
        return
      }

      const rect = section.getBoundingClientRect()
      const inSection = e.clientY >= rect.top && e.clientY <= rect.bottom
      
      if (!inSection) return

      // Calculate center dead zone (50% of screen width)
      const screenWidth = window.innerWidth
      const deadZoneStart = screenWidth * 0.25  // 25% from left
      const deadZoneEnd = screenWidth * 0.75    // 75% from left
      
      const inDeadZone = e.clientX >= deadZoneStart && e.clientX <= deadZoneEnd
      
      if (inDeadZone) {
        // In center - kill the scroll trigger temporarily
        scrollTriggerInstance.current?.disable()
      } else {
        // In edge zones - enable it
        scrollTriggerInstance.current?.enable()
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const projects = [
    {
      title: 'Classic Ping Pong',
      description: 'A comprehensive Ping Pong game featuring an adaptive AI that adapts to you. fluid animations, and modern design patterns.',
      image: '/images/project-1.png',
      tags: ['HTML 5', 'CSS', 'Javascript'],
      liveUrl: '#',
      githubUrl: '#',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      title: 'Hotel Booking System',
      description: 'An comprehensive webpage that had a fully functioning backend and booking system for hotel booking purposes.',
      image: '/images/project-2.jpg',
      tags: ['PHP', 'Javascript', 'Apache', 'HTML 5', 'React', 'SlideJS', 'NodeJS'],
      liveUrl: '#',
      githubUrl: '#',
      color: 'from-purple-400 to-pink-400'
    },
    {
      title: 'AI Image Upscaler',
      description: 'Offline image upscaler using ESRGAN technology, CPU and GPU. Up to 8X upscale.',
      image: '/images/project-3.jpg',
      tags: ['Python', 'HTML 5', 'Javascript'],
      liveUrl: '#',
      githubUrl: 'https://github.com/GoldJS/img-upscaler',
      color: 'from-green-400 to-emerald-400'
    },
    {
      title: 'A1EMU',
      description: 'An All in One Emulator',
      image: '/images/project-4.jpg',
      tags: ['RUST', 'C++'],
      liveUrl: '#',
      githubUrl: 'https://github.com/GoldJS/A1EMU',
      color: 'from-orange-400 to-red-400'
    }
  ]

  return (
    <section 
      ref={sectionRef}
      id="projects"
      className="section-container relative min-h-screen bg-frutiger-light overflow-hidden"
    >
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-frutiger-cyan/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="h-screen flex flex-col justify-center">
        {/* Section Header */}
        <div className="px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-7xl mx-auto">
            <span className="inline-block px-4 py-2 glass-card rounded-full text-sm font-medium text-frutiger-blue mb-4">
              Portfolio
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-frutiger-dark mb-4">
              Selected <span className="text-gradient">Works</span>
            </h2>
            <p className="text-lg text-frutiger-dark/70 max-w-xl">
              A collection of projects that showcase my passion for creating beautiful, functional digital experiences.
            </p>
          </div>
        </div>

        {/* Horizontal Scroll Track - EXACTLY as original */}
        <div 
          ref={trackRef}
          className="flex gap-8 px-4 sm:px-6 lg:px-8 will-change-transform"
        >
          {/* Spacer */}
          <div className="flex-shrink-0 w-[10vw]" />

          {/* Project Cards */}
          {projects.map((project, index) => (
            <div
              key={index}
              className="project-card flex-shrink-0 w-[80vw] md:w-[50vw] lg:w-[40vw]"
              onMouseEnter={() => setActiveProject(index)}
              onMouseLeave={() => setActiveProject(null)}
            >
              <div className="glass-card-strong rounded-3xl overflow-hidden h-full group hover:scale-[1.02] transition-all duration-500">
                {/* Image */}
                <div className="relative aspect-[3/2] overflow-hidden">
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${project.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  
                  {/* Hover Actions */}
                  <div className={`absolute inset-0 flex items-center justify-center gap-4 transition-all duration-500 ${
                    activeProject === index ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <a 
                      href={project.liveUrl}
                      className="glass-button p-3 rounded-full hover:scale-110 transition-transform"
                    >
                      <ExternalLink className="w-6 h-6" />
                    </a>
                    <a 
                      href={project.githubUrl}
                      className="glass-button p-3 rounded-full hover:scale-110 transition-transform"
                    >
                      <Github className="w-6 h-6" />
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-frutiger-dark mb-2 group-hover:text-frutiger-blue transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-frutiger-dark/70 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="px-3 py-1 glass-card rounded-full text-xs font-medium text-frutiger-blue"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Link */}
                  <a 
                    href={project.liveUrl}
                    className="inline-flex items-center gap-2 text-frutiger-blue font-medium group/link"
                  >
                    View Project
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          ))}

          {/* End Spacer */}
          <div className="flex-shrink-0 w-[10vw]" />
        </div>

        {/* Scroll Indicator - EXACTLY as original */}
        <div className="px-4 sm:px-6 lg:px-8 mt-8">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-r from-frutiger-blue to-frutiger-cyan rounded-full animate-pulse" />
            </div>
            <span className="text-sm text-frutiger-dark/60">Scroll to explore</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Projects