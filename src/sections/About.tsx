import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Sparkles, Zap, Heart } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const About = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image 3D flip animation
      gsap.fromTo(imageRef.current,
        { rotateY: 90, opacity: 0 },
        {
          rotateY: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Content fade in
      gsap.fromTo(contentRef.current?.children || [],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Stats counter animation
      const statNumbers = statsRef.current?.querySelectorAll('.stat-number')
      statNumbers?.forEach((stat) => {
        const target = parseInt(stat.getAttribute('data-target') || '0')
        gsap.fromTo(stat,
          { innerText: 0 },
          {
            innerText: target,
            duration: 2,
            ease: 'power2.out',
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })

      // 3D tilt effect on scroll
      gsap.to(imageRef.current, {
        rotateX: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const stats = [
    { icon: Sparkles, value: 1, suffix: '+', label: 'Years Experience' },
    { icon: Zap, value: 5, suffix: '+', label: 'Projects Completed' },
    { icon: Heart, value: 100, suffix: '%', label: 'Passion' },
  ]

  return (
    <section 
      ref={sectionRef}
      id="about"
      className="section-container relative py-24 lg:py-32 bg-frutiger-light"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-frutiger-cyan/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Column */}
          <div 
            ref={imageRef}
            className="relative perspective-1000"
          >
            <div className="relative preserve-3d">
              {/* Main Image */}
              <div className="glass-card-strong p-3 rounded-3xl overflow-hidden">
                <img 
                  src="/images/about-image.jpg" 
                  alt="About Me"
                  className="w-full h-auto rounded-2xl object-cover aspect-[4/5]"
                />
              </div>
              
              {/* Floating decoration */}
              <div className="absolute -bottom-6 -right-6 glass-card p-4 rounded-2xl animate-float">
                <Sparkles className="w-8 h-8 text-frutiger-blue" />
              </div>
              
              {/* Background glow */}
              <div className="absolute -inset-4 bg-frutiger-cyan/20 rounded-[2rem] blur-2xl -z-10" />
            </div>
          </div>

          {/* Content Column */}
          <div ref={contentRef} className="space-y-6">
            <div>
              <span className="inline-block px-4 py-2 glass-card rounded-full text-sm font-medium text-frutiger-blue mb-4">
                About Me
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-frutiger-dark mb-4">
                Creating Digital <span className="text-gradient">Masterpieces.</span>
              </h2>
            </div>

            <p className="text-lg text-frutiger-dark/70 leading-relaxed">
              I am a software engineer focused on building clean, efficient, and user-friendly digital experiences.
              My work bridges the gap between practical problem-solving and elegant technical solutions,
              inspired by modern web development principles that emphasize clarity, usability, and maintainability.
            </p>

            <p className="text-lg text-frutiger-dark/70 leading-relaxed">
              With a passion for Python, full-stack development, and interactive projects,
              I strive to create software that not only works seamlessly but also delivers meaningful and intuitive experiences for users.
            </p>

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-3 gap-4 pt-6">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="glass-card p-4 rounded-2xl text-center group hover:scale-105 transition-transform"
                >
                  <stat.icon className="w-6 h-6 text-frutiger-blue mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-2xl lg:text-3xl font-bold text-frutiger-dark">
                    <span className="stat-number" data-target={stat.value}>0</span>
                    <span className="text-frutiger-cyan">{stat.suffix}</span>
                  </div>
                  <div className="text-xs text-frutiger-dark/60 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
