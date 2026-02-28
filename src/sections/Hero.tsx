import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const bubblesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation - letter stagger
      const titleChars = titleRef.current?.querySelectorAll('.char')
      if (titleChars) {
        gsap.fromTo(titleChars,
          { y: 100, opacity: 0, rotateX: 90 },
          { 
            y: 0, 
            opacity: 1, 
            rotateX: 0,
            duration: 1.2, 
            ease: 'expo.out',
            stagger: 0.05,
            delay: 0.5
          }
        )
      }

      // Subtitle animation
      gsap.fromTo(subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 1.2 }
      )

      // Button animation
      gsap.fromTo(buttonRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.5)', delay: 1.5 }
      )

      // Scroll parallax effect
      gsap.to(titleRef.current, {
        y: -200,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '50% top',
          scrub: true
        }
      })

      gsap.fromTo(subtitleRef.current,
        {y: 0, opacity: 1},
        {
          y: -150,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '40% top',
            scrub: true
          }
        }
      );
      // Bubble animations
      const bubbles = bubblesRef.current?.querySelectorAll('.bubble')
      bubbles?.forEach((bubble, i) => {
        gsap.to(bubble, {
          y: '-100vh',
          duration: 15 + Math.random() * 10,
          ease: 'none',
          repeat: -1,
          delay: i * 2
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about')
    aboutSection?.scrollIntoView({ behavior: 'smooth' })
  }

  // Split title into characters
  const title = 'My Resume'
  const titleChars = title.split('').map((char, i) => (
    <span key={i} className="char inline-block" style={{ display: char === ' ' ? 'inline' : 'inline-block' }}>
      {char === ' ' ? '\u00A0' : char}
    </span>
  ))

  return (
    <section 
      ref={sectionRef}
      id="hero"
      className="section-container relative flex items-center justify-center min-h-screen"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/hero-bg.jpg" 
          alt="Frutiger Aero Background"
          className="w-full h-full object-cover"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-frutiger-blue/30 via-transparent to-frutiger-light/80" />
      </div>

      {/* Floating Bubbles */}
      <div ref={bubblesRef} className="bubbles-container z-10">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bubble"
            style={{
              width: `${20 + Math.random() * 60}px`,
              height: `${20 + Math.random() * 60}px`,
              left: `${Math.random() * 100}%`,
              bottom: '-100px',
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 perspective-1000">
        {/* Main Title */}
        <h1 
          ref={titleRef}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-6 drop-shadow-2xl preserve-3d"
          style={{ textShadow: '0 4px 30px rgba(0, 168, 232, 0.5)' }}
        >
          {titleChars}
        </h1>

        {/* Subtitle */}
        <p 
          ref={subtitleRef}
          className="text-xl sm:text-2xl md:text-3xl text-white/90 font-light mb-12 max-w-2xl mx-auto"
          style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)' }}
        >
          Software Engineering Graduate
        </p>

        {/* CTA Button */}
        <button
          ref={buttonRef}
          onClick={scrollToAbout}
          className="glass-button text-lg group"
        >
          <span className="relative z-10 flex items-center gap-2">
            Dive In
            <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </span>
        </button>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-frutiger-light to-transparent z-10" />
    </section>
  )
}

export default Hero
