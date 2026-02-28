import { useState, useRef, useEffect } from 'react'
import { Music, Volume2, VolumeX, Play, Pause, SkipForward, SkipBack, ChevronUp } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showTooltip, setShowTooltip] = useState(true)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isInHero, setIsInHero] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const bubbleRef = useRef<HTMLButtonElement>(null)

  const playlist = [
    {
      url: '/music/Infinity Frequencies - Traces.mp3',
      title: 'Traces - Infinity Frequencies'
    },
    {
      url: '/music/Mii Editor - Mii Maker (Wii U) Music.mp3',
      title: 'Mii Editor in Mii Maker (Wii U)'
    },
    {
      url: '/music/scizzie - aquatic ambience.mp3',
      title: 'Aquatic Ambience - scizzie'
    }
  ]

  // Track scroll position for mobile morphing
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero')
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect()
        // If hero is still visible (bottom of hero hasn't scrolled past viewport top)
        setIsInHero(rect.bottom > 100)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    audioRef.current = new Audio(playlist[currentTrack].url)
    audioRef.current.loop = true
    audioRef.current.volume = 0.3

    const tooltipTimer = setTimeout(() => {
      setShowTooltip(false)
    }, 5000)

    // Desktop entrance animation
    if (window.innerWidth >= 1024) {
      gsap.fromTo(playerRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 3 }
      )
    }

    return () => {
      clearTimeout(tooltipTimer)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = playlist[currentTrack].url
      if (isPlaying && !isMuted) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false)
        })
      }
    }
  }, [currentTrack])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && !isMuted) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, isMuted])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
  }, [isMuted])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length)
  }

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length)
  }

  // Mobile bubble click handler
  const handleBubbleClick = () => {
    setIsExpanded(!isExpanded)
  }

  // Close expanded when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bubbleRef.current && !bubbleRef.current.contains(e.target as Node)) {
        setIsExpanded(false)
      }
    }
    if (isExpanded) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isExpanded])

  return (
    <>
      {/* Desktop: Original bottom-right player */}
      <div className="hidden lg:block">
        <div 
          ref={playerRef}
          className="fixed bottom-6 right-6 z-50"
        >
          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute bottom-full right-0 mb-3 glass-card-strong px-4 py-2 rounded-xl whitespace-nowrap animate-bounce">
              <span className="text-sm text-frutiger-dark">Click to play Frutiger music!</span>
              <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white/30" />
            </div>
          )}

          {/* Player */}
          <div className="glass-card-strong p-3 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-frutiger-dark/70 font-medium">
                {currentTrack + 1} / {playlist.length}
              </span>
              <span className="text-xs text-frutiger-dark truncate max-w-[120px]">
                {playlist[currentTrack].title}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-gradient-to-br from-frutiger-blue to-frutiger-cyan ${isPlaying ? 'animate-pulse' : ''}`}>
                <Music className="w-4 h-4 text-white" />
              </div>

              <div className="flex items-end gap-0.5 h-6 flex-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-frutiger-blue rounded-full transition-all duration-300 ${
                      isPlaying && !isMuted ? 'animate-wave' : 'h-1'
                    }`}
                    style={{
                      height: isPlaying && !isMuted ? '100%' : '4px',
                      animationDelay: `${i * 0.1}s`,
                      animation: isPlaying && !isMuted ? `wave 0.5s ease-in-out infinite ${i * 0.1}s` : 'none'
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1">
                <button onClick={prevTrack} className="p-1.5 hover:bg-white/20 rounded-xl transition-colors">
                  <SkipBack className="w-3 h-3 text-frutiger-dark" />
                </button>
                <button onClick={togglePlay} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                  {isPlaying ? <Pause className="w-4 h-4 text-frutiger-dark" /> : <Play className="w-4 h-4 text-frutiger-dark" />}
                </button>
                <button onClick={nextTrack} className="p-1.5 hover:bg-white/20 rounded-xl transition-colors">
                  <SkipForward className="w-3 h-3 text-frutiger-dark" />
                </button>
                <button onClick={toggleMute} className="p-2 hover:bg-white/20 rounded-xl transition-colors ml-1">
                  {isMuted ? <VolumeX className="w-4 h-4 text-frutiger-dark/50" /> : <Volume2 className="w-4 h-4 text-frutiger-dark" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Morphing Player */}
      <div className="lg:hidden">
        {/* Full player in hero section */}
        <div 
          className={`fixed z-50 transition-all duration-500 ease-out ${
            isInHero 
              ? 'bottom-6 right-6 left-6' 
              : 'opacity-0 pointer-events-none translate-y-10'
          }`}
        >
          <div className="glass-card-strong p-3 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-frutiger-dark/70 font-medium">
                {currentTrack + 1} / {playlist.length}
              </span>
              <span className="text-xs text-frutiger-dark truncate max-w-[150px]">
                {playlist[currentTrack].title}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-gradient-to-br from-frutiger-blue to-frutiger-cyan ${isPlaying ? 'animate-pulse' : ''}`}>
                <Music className="w-4 h-4 text-white" />
              </div>

              <div className="flex items-end gap-0.5 h-6 flex-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-frutiger-blue rounded-full transition-all duration-300 ${
                      isPlaying && !isMuted ? 'animate-wave' : 'h-1'
                    }`}
                    style={{
                      height: isPlaying && !isMuted ? '100%' : '4px',
                      animationDelay: `${i * 0.1}s`,
                      animation: isPlaying && !isMuted ? `wave 0.5s ease-in-out infinite ${i * 0.1}s` : 'none'
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1">
                <button onClick={prevTrack} className="p-1.5 hover:bg-white/20 rounded-xl transition-colors">
                  <SkipBack className="w-3 h-3 text-frutiger-dark" />
                </button>
                <button onClick={togglePlay} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                  {isPlaying ? <Pause className="w-4 h-4 text-frutiger-dark" /> : <Play className="w-4 h-4 text-frutiger-dark" />}
                </button>
                <button onClick={nextTrack} className="p-1.5 hover:bg-white/20 rounded-xl transition-colors">
                  <SkipForward className="w-3 h-3 text-frutiger-dark" />
                </button>
                <button onClick={toggleMute} className="p-2 hover:bg-white/20 rounded-xl transition-colors ml-1">
                  {isMuted ? <VolumeX className="w-4 h-4 text-frutiger-dark/50" /> : <Volume2 className="w-4 h-4 text-frutiger-dark" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bubble in navbar when scrolled */}
        <div 
          className={`fixed top-4 right-4 z-50 transition-all duration-500 ease-out ${
            !isInHero 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 -translate-y-10 pointer-events-none'
          }`}
        >
          {/* Expanded dropdown */}
          {isExpanded && (
            <div className="absolute top-full right-0 mt-2 glass-card-strong p-4 rounded-2xl min-w-[280px] animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-frutiger-dark/70 font-medium">
                  {currentTrack + 1} / {playlist.length}
                </span>
                <span className="text-xs text-frutiger-dark truncate max-w-[180px]">
                  {playlist[currentTrack].title}
                </span>
              </div>

              <div className="flex items-center justify-center gap-4 mb-3">
                <button onClick={prevTrack} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                  <SkipBack className="w-4 h-4 text-frutiger-dark" />
                </button>
                <button onClick={togglePlay} className="p-3 bg-gradient-to-br from-frutiger-blue to-frutiger-cyan rounded-full hover:scale-110 transition-transform">
                  {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
                </button>
                <button onClick={nextTrack} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                  <SkipForward className="w-4 h-4 text-frutiger-dark" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-end gap-0.5 h-4 flex-1 mr-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 bg-frutiger-blue rounded-full transition-all duration-300 ${
                        isPlaying && !isMuted ? 'animate-wave' : 'h-1'
                      }`}
                      style={{
                        height: isPlaying && !isMuted ? '100%' : '4px',
                        animationDelay: `${i * 0.1}s`,
                        animation: isPlaying && !isMuted ? `wave 0.5s ease-in-out infinite ${i * 0.1}s` : 'none'
                      }}
                    />
                  ))}
                </div>
                <button onClick={toggleMute} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                  {isMuted ? <VolumeX className="w-4 h-4 text-frutiger-dark/50" /> : <Volume2 className="w-4 h-4 text-frutiger-dark" />}
                </button>
              </div>

              {/* Chevron indicator */}
              <div className="absolute -top-2 right-4 w-4 h-4 bg-white/30 backdrop-blur-xl rotate-45 rounded-sm" />
            </div>
          )}

          {/* Bubble button */}
          <button
            ref={bubbleRef}
            onClick={handleBubbleClick}
            className={`glass-card-strong p-3 rounded-full transition-all duration-300 hover:scale-110 ${
              isExpanded ? 'bg-frutiger-blue/20' : ''
            }`}
          >
            <div className="relative">
              <Music className={`w-5 h-5 text-frutiger-dark transition-all duration-300 ${
                isExpanded ? 'rotate-12' : ''
              }`} />
              {isPlaying && !isExpanded && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-frutiger-cyan rounded-full animate-pulse" />
              )}
              {isExpanded && <ChevronUp className="absolute -bottom-1 -right-1 w-3 h-3 text-frutiger-blue" />}
            </div>
          </button>
        </div>
      </div>
    </>
  )
}

export default MusicPlayer
