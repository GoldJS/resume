import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const Education = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline items animation
      const items = timelineRef.current?.querySelectorAll('.timeline-item')
      items?.forEach((item, index) => {
        gsap.fromTo(item,
          { x: index % 2 === 0 ? -50 : 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })

      // Timeline line animation
      gsap.fromTo('.timeline-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const educationData = [
    {
      degree: 'Bachelor of Software Engineering',
      school: 'University of Greater Manchester, Bolton',
      location: 'London, United Kingdom',
      period: '2024 - 2025',
      description: 'Specialized in Software functions, backend functionality and UI/UX Design. Graduated with honors.',
      achievements: ['Unique Project', 'Great Thesis Writing'],
      icon: Award
    },
    {
      degree: 'Higher National Diploma of Computer Science',
      school: 'Explore Education Institution',
      location: 'Dubai, United Arab Emirates',
      period: '2023 - 2024',
      description: 'Focused on the many fundamentals and basics that would be beneficial for a Software Engineer.',
      achievements: ['Great Application Results', 'Merit-Based'],
      icon: GraduationCap
    },
    {
      degree: 'Diploma of Computer Science',
      school: 'British College of Applied Studies',
      location: 'Colombo, Sri Lanka',
      period: '2022',
      description: 'Professional certification in Microsoft Applications and Web Development.',
      achievements: ['Perfect Score'],
      icon: Award
    }
  ]

  return (
    <section 
      ref={sectionRef}
      id="education"
      className="section-container relative py-24 lg:py-32 bg-frutiger-light overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-frutiger-cyan/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-frutiger-blue/10 rounded-full blur-3xl translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 glass-card rounded-full text-sm font-medium text-frutiger-blue mb-4">
            Education
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-frutiger-dark mb-4">
            Academic <span className="text-gradient">Journey</span>
          </h2>
          <p className="text-lg text-frutiger-dark/70 max-w-2xl mx-auto">
            My educational background has shaped my approach to design and development.
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="timeline-line absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-frutiger-blue via-frutiger-cyan to-frutiger-aqua rounded-full transform -translate-x-1/2 origin-top hidden lg:block" />
          
          {/* Mobile Timeline Line */}
          <div className="timeline-line absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-frutiger-blue via-frutiger-cyan to-frutiger-aqua rounded-full origin-top lg:hidden" />

          {/* Timeline Items */}
          <div className="space-y-12">
            {educationData.map((edu, index) => (
              <div 
                key={index}
                className={`timeline-item relative flex items-start gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Content Card */}
                <div className={`flex-1 ml-12 lg:ml-0 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                  <div className="glass-card-strong p-6 rounded-2xl hover:scale-[1.02] transition-transform group">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-frutiger-dark group-hover:text-frutiger-blue transition-colors">
                          {edu.degree}
                        </h3>
                        <p className="text-frutiger-dark/70">{edu.school}</p>
                      </div>
                      <div className="glass-card p-2 rounded-xl">
                        <edu.icon className="w-5 h-5 text-frutiger-blue" />
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-frutiger-dark/60">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {edu.period}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {edu.location}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-frutiger-dark/70 mb-4">{edu.description}</p>

                    {/* Achievements */}
                    <div className="flex flex-wrap gap-2">
                      {edu.achievements.map((achievement, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 glass-card rounded-full text-xs font-medium text-frutiger-blue"
                        >
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="absolute left-4 lg:left-1/2 top-6 w-4 h-4 bg-frutiger-cyan rounded-full border-4 border-white shadow-glow transform -translate-x-1/2 z-10" />

                {/* Empty space for alternating layout */}
                <div className="hidden lg:block flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Education
