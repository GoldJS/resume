import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Send, Mail, MapPin, Phone, Linkedin, Github,} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Form panel rise animation
      gsap.fromTo(formRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Input lines draw animation
      const inputs = formRef.current?.querySelectorAll('.input-line')
      inputs?.forEach((input, index) => {
        gsap.fromTo(input,
          { width: '0%' },
          {
            width: '100%',
            duration: 0.8,
            ease: 'power1.inOut',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse'
            },
            delay: 0.5 + index * 0.1
          }
        )
      })

      // Contact info items
      const infoItems = sectionRef.current?.querySelectorAll('.contact-info-item')
      infoItems?.forEach((item, index) => {
        gsap.fromTo(item,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse'
            },
            delay: 0.3 + index * 0.1
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: '', email: '', message: '' })
    
    // Reset success message after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'isayusuf0416@gmail.com' },
    { icon: Phone, label: 'Phone', value: '+971 (52) 934 6982' },
    { icon: MapPin, label: 'Location', value: 'Dubai, UAE' },
  ]

  const socialLinks = [
    { icon: Linkedin, href: 'https://www.linkedin.com/in/mohamed-isa-6a42181b1/', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/GoldJS', label: 'GitHub' },
  ]

  return (
    <section 
      ref={sectionRef}
      id="contact"
      className="section-container relative py-24 lg:py-32 bg-frutiger-light overflow-hidden"
    >
      {/* Background liquid effect simulation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-frutiger-blue/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-frutiger-cyan/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 glass-card rounded-full text-sm font-medium text-frutiger-blue mb-4">
            Contact
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-frutiger-dark mb-4">
            Get in <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-lg text-frutiger-dark/70 max-w-2xl mx-auto">
            Have a project in mind? Let's create something beautiful together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div 
                  key={index}
                  className="contact-info-item flex items-center gap-4 glass-card p-4 rounded-2xl hover:scale-[1.02] transition-transform"
                >
                  <div className="p-3 bg-gradient-to-br from-frutiger-blue to-frutiger-cyan rounded-xl">
                    <info.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-frutiger-dark/60">{info.label}</p>
                    <p className="font-medium text-frutiger-dark">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-bold text-frutiger-dark mb-4">Follow Me</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="glass-card p-3 rounded-xl hover:scale-110 hover:bg-white/30 transition-all group"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-frutiger-blue group-hover:text-frutiger-cyan transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form 
            ref={formRef}
            onSubmit={handleSubmit}
            className="glass-card-strong p-8 rounded-3xl space-y-6"
          >
            {/* Name Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-frutiger-dark/70 mb-2">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="glass-input"
                placeholder="John Doe"
              />
              <div className="input-line absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-frutiger-blue to-frutiger-cyan" />
            </div>

            {/* Email Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-frutiger-dark/70 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="glass-input"
                placeholder="john@example.com"
              />
              <div className="input-line absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-frutiger-blue to-frutiger-cyan" />
            </div>

            {/* Message Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-frutiger-dark/70 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="glass-input resize-none"
                placeholder="Tell me about your project..."
              />
              <div className="input-line absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-frutiger-blue to-frutiger-cyan" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full glass-button flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              ) : isSubmitted ? (
                <>Message Sent!</>
              ) : (
                <>
                  Send Message
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
