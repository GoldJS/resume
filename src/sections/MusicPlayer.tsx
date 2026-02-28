import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Music, Volume2, VolumeX, Play, Pause, SkipForward, SkipBack } from 'lucide-react'
import { gsap } from 'gsap'

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showTooltip, setShowTooltip] = useState(true)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isInNavbar, setIsInNavbar] = useState(false)
  const [progress, setProgress] = useState(0)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const bubbleRef = useRef<HTMLButtonElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const waveBarsRef = useRef<HTMLDivElement[]>([])

  const playlist = useMemo(() => [
    {
      url: '/music/Infinity Frequencies - Traces.mp3',
      title: 'Traces - Infinity Frequencies'
    },
    {
      url: '/music/Mii Editor - Mii Maker (Wii U) Music.mp3',
      title: 'Mii Editor'
    },
    {
      url: '/music/scizzie - aquatic ambience.mp3',
      title: 'Aquatic Ambience'
    }
  ], [])

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(playlist[currentTrack].url)
    audioRef.current.loop = true
    audioRef.current.volume = 0.3

    const tooltipTimer = setTimeout(() => {
      setShowTooltip(false)
    }, 5000)

    // Entrance animation (like original)
    gsap.fromTo(playerRef.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 3 }
    )

    return () => {
      clearTimeout(tooltipTimer)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Handle track changes without re-rendering waves
  useEffect(() => {
    if (!audioRef.current) return
    
    const wasPlaying = isPlaying && !isMuted
    audioRef.current.src = playlist[currentTrack].url
    setProgress(0)
    
    if (wasPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false))
    }
  }, [currentTrack, playlist])

  // Handle play/pause/mute
  useEffect(() => {
    if (!audioRef.current) return
    
    if (isPlaying && !isMuted) {
      audioRef.current.play().catch(() => setIsPlaying(false))
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, isMuted])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
  }, [isMuted])

  // Progress tracking (throttled for performance)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    let rafId: number
    const updateProgress = () => {
      if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100
        setProgress(percent)
      }
      rafId = requestAnimationFrame(updateProgress)
    }

    audio.addEventListener('play', () => {
      rafId = requestAnimationFrame(updateProgress)
    })
    audio.addEventListener('pause', () => {
      cancelAnimationFrame(rafId)
    })

    return () => {
      cancelAnimationFrame(rafId)
      audio.removeEventListener('play', updateProgress)
      audio.removeEventListener('pause', updateProgress)
    }
  }, [currentTrack])

  // Scroll animation (like original but optimized)
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero')
      if (!heroSection || !playerRef.current) return

      const heroRect = heroSection.getBoundingClientRect()
      const heroHeight = heroRect.height
      const scrollProgress = Math.max(0, Math.min(1, -heroRect.top / (heroHeight * 0.5)))
      
      gsap.to(playerRef.current, {
        x: scrollProgress * window.innerWidth,
        opacity: 1 - scrollProgress,
        duration: 0.1,
        ease: 'none',
        overwrite: true
      })

      if (scrollProgress > 0.8 && !isInNavbar) {
        setIsInNavbar(true)
      } else if (scrollProgress <= 0.8 && isInNavbar) {
        setIsInNavbar(false)
        setIsExpanded(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isInNavbar])

  // Click outside handler
  useEffect(() => {
    if (!isExpanded) return
    
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node
      const isInsideBubble = bubbleRef.current?.contains(target)
      const isInsidePopup = popupRef.current?.contains(target)
      
      if (!isInsideBubble && !isInsidePopup) {
        setIsExpanded(false)
      }
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [isExpanded])

  // Stable callbacks to prevent re-renders
  const togglePlay = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPlaying(prev => !prev)
  }, [])

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMuted(prev => !prev)
  }, [])

  const nextTrack = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentTrack(prev => (prev + 1) % playlist.length)
  }, [playlist.length])

  const prevTrack = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentTrack(prev => (prev - 1 + playlist.length) % playlist.length)
  }, [playlist.length])

  // Static wave bars - no re-renders
  const WaveBars = useMemo(() => (
    <div className="flex items-end gap-0.5 h-6">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          ref={el => el && (waveBarsRef.current[i] = el)}
          className="w-1 bg-frutiger-blue rounded-full"
          style={{
            height: '16px',
            transition: 'transform 0.2s ease',
            transform: isPlaying && !isMuted ? 'scaleY(1)' : 'scaleY(0.3)',
            transformOrigin: 'bottom',
            animation: isPlaying && !isMuted ? `wave 0.5s ease-in-out infinite ${i * 0.1}s` : 'none'
          }}
        />
      ))}
    </div>
  ), [isPlaying, isMuted]) // Only re-render when play state changes

  const PlayerContent = () => (
    <div className="glass-card-strong p-3 rounded-2xl flex flex-col gap-2 w-[280px]">
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

        {WaveBars}

        <div className="flex items-center gap-1 touch-none">
          <button
            onClick={prevTrack}
            className="p-1.5 rounded-xl transition-colors active:bg-white/30"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <SkipBack className="w-3 h-3 text-frutiger-dark" />
          </button>
          <button
            onClick={togglePlay}
            className="p-2 rounded-xl transition-colors active:bg-white/30"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-frutiger-dark" /> : <Play className="w-4 h-4 text-frutiger-dark" />}
          </button>
          <button
            onClick={nextTrack}
            className="p-1.5 rounded-xl transition-colors active:bg-white/30"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <SkipForward className="w-3 h-3 text-frutiger-dark" />
          </button>
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl transition-colors ml-1 active:bg-white/30"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-frutiger-dark/50" /> : <Volume2 className="w-4 h-4 text-frutiger-dark" />}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block fixed bottom-6 right-6 z-50">
        {showTooltip && (
          <div className="absolute bottom-full right-0 mb-3 glass-card-strong px-4 py-2 rounded-xl whitespace-nowrap animate-bounce">
            <span className="text-sm text-frutiger-dark">Click to play Frutiger music!</span>
            <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white/30" />
          </div>
        )}
        <PlayerContent />
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        {/* Hero player */}
        <div 
          ref={playerRef}
          className={`fixed bottom-6 right-6 will-change-transform ${
            isInNavbar ? 'opacity-0 pointer-events-none z-30' : 'opacity-100 z-40'
          }`}
          style={{ transform: 'translateX(0)' }}
        >
          <PlayerContent />
        </div>

        {/* Navbar bubble */}
        <div 
          className={`fixed top-5 right-14 transition-all duration-500 ease-out ${
            isInNavbar ? 'opacity-100 translate-y-0 pointer-events-auto z-50' : 'opacity-0 -translate-y-20 pointer-events-none z-30'
          }`}
        >
          {/* Popup */}
          <div 
            ref={popupRef}
            className={`absolute top-full right-0 mt-2 transition-all duration-300 ${
              isExpanded ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
          >
            <PlayerContent />
          </div>

          {/* Bubble button */}
          <button
            ref={bubbleRef}
            onClick={() => setIsExpanded(!isExpanded)}
            className="relative w-9 h-9 glass-card-strong rounded-full flex items-center justify-center active:scale-95 transition-transform"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(0,168,232,0.2)" strokeWidth="2" />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="#00a8e8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${progress * 0.94} 94`}
                className="transition-all duration-300"
              />
            </svg>
            <div className="relative z-10 flex items-center justify-center w-full h-full">
              <Music className={`w-3.5 h-3.5 text-frutiger-dark ${isPlaying ? 'animate-pulse' : ''}`} />
            </div>
            {isPlaying && !isExpanded && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-frutiger-cyan rounded-full animate-pulse border-2 border-white" />
            )}
          </button>
        </div>
      </div>
    </>
  )
}

export default MusicPlayer
