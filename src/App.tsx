import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'

// Import sections
import Hero from './sections/Hero'
import About from './sections/About'
import Education from './sections/Education'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Contact from './sections/Contact'
import Navigation from './sections/Navigation'
import MusicPlayer from './sections/MusicPlayer'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const mainRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Initialize smooth scroll behavior
    const ctx = gsap.context(() => {
      // Fade in the entire app
      gsap.fromTo(mainRef.current, 
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.out', onComplete: () => setIsLoaded(true) }
      )
    }, mainRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={mainRef} className="relative">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="relative">
        <Hero />
        <About />
        <Education />
        <Skills />
        <Projects />
        <Contact />
      </main>

      {/* Background Music Player */}
      <MusicPlayer />

      {/* Loading Screen */}
      {!isLoaded && (
        <div className="fixed inset-0 z-[100] bg-gradient-to-br from-frutiger-blue via-frutiger-cyan to-frutiger-aqua flex items-center justify-center">
          <div className="glass-card-strong p-8 rounded-full animate-pulse">
            <div className="w-12 h-12 border-4 border-white/50 border-t-white rounded-full animate-spin" />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
