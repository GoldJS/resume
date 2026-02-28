import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Code2, 
  Palette, 
  Layers, 
  Smartphone, 
  Database, 
  Globe,
  Figma,
  GitBranch,
  Terminal,
  Cpu
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cards stagger animation
      const cards = cardsRef.current?.querySelectorAll('.skill-card')
      cards?.forEach((card, index) => {
        gsap.fromTo(card,
          { y: 60, opacity: 0, rotateX: -15 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            },
            delay: index * 0.1
          }
        )
      })

      // Skill bars animation
      const skillBars = sectionRef.current?.querySelectorAll('.skill-bar-fill')
      skillBars?.forEach((bar) => {
        const width = bar.getAttribute('data-width') || '0%'
        gsap.fromTo(bar,
          { width: '0%' },
          {
            width: width,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: bar,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const skillCategories = [
    {
      title: 'Frontend Development',
      icon: Code2,
      skills: [
        { name: 'React / Next.js', level: 95 },
        { name: 'TypeScript', level: 90 },
        { name: 'Tailwind CSS', level: 95 },
        { name: 'Vue.js', level: 80 },
      ],
      color: 'from-blue-400 to-cyan-400'
    },
    {
      title: 'UI/UX Design',
      icon: Palette,
      skills: [
        { name: 'Figma', level: 92 },
        { name: 'Adobe XD', level: 85 },
        { name: 'Prototyping', level: 88 },
        { name: 'Design Systems', level: 90 },
      ],
      color: 'from-purple-400 to-pink-400'
    },
    {
      title: 'Backend & Database',
      icon: Database,
      skills: [
        { name: 'Node.js', level: 85 },
        { name: 'PostgreSQL', level: 80 },
        { name: 'MongoDB', level: 82 },
        { name: 'GraphQL', level: 78 },
      ],
      color: 'from-green-400 to-emerald-400'
    },
    {
      title: 'Mobile Development',
      icon: Smartphone,
      skills: [
        { name: 'React Native', level: 85 },
        { name: 'Flutter', level: 75 },
        { name: 'iOS / Swift', level: 70 },
        { name: 'Android / Kotlin', level: 68 },
      ],
      color: 'from-orange-400 to-red-400'
    },
  ]

  const tools = [
    { name: 'Git', icon: GitBranch },
    { name: 'Figma', icon: Figma },
    { name: 'VS Code', icon: Terminal },
    { name: 'Docker', icon: Layers },
    { name: 'AWS', icon: Globe },
    { name: 'AI/ML', icon: Cpu },
  ]

  return (
    <section 
      ref={sectionRef}
      id="skills"
      className="section-container relative py-24 lg:py-32 bg-frutiger-light"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-frutiger-cyan/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 glass-card rounded-full text-sm font-medium text-frutiger-blue mb-4">
            Skills
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-frutiger-dark mb-4">
            My <span className="text-gradient">Expertise</span>
          </h2>
          <p className="text-lg text-frutiger-dark/70 max-w-2xl mx-auto">
            A comprehensive set of skills honed through years of practice and continuous learning.
          </p>
        </div>

        {/* Skills Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-2 gap-6 mb-16">
          {skillCategories.map((category, index) => (
            <div 
              key={index}
              className="skill-card glass-card-strong p-6 rounded-2xl hover:scale-[1.02] transition-all group perspective-1000"
            >
              {/* Card Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} shadow-lg group-hover:scale-110 transition-transform`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-frutiger-dark">{category.title}</h3>
              </div>

              {/* Skills List */}
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-frutiger-dark/80">{skill.name}</span>
                      <span className="text-sm text-frutiger-blue">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                      <div 
                        className={`skill-bar-fill h-full rounded-full bg-gradient-to-r ${category.color}`}
                        data-width={`${skill.level}%`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tools Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-frutiger-dark mb-8">Tools & Technologies</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {tools.map((tool, index) => (
              <div 
                key={index}
                className="glass-card px-6 py-3 rounded-full flex items-center gap-2 hover:scale-110 hover:bg-white/30 transition-all cursor-default group"
              >
                <tool.icon className="w-5 h-5 text-frutiger-blue group-hover:text-frutiger-cyan transition-colors" />
                <span className="font-medium text-frutiger-dark">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills
