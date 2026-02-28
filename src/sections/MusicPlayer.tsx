import { useState, useRef, useEffect } from 'react'
import { Music, Volume2, VolumeX, Play, Pause, SkipForward, SkipBack } from 'lucide-react'
import { gsap } from 'gsap'

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showTooltip, setShowTooltip] = useState(true)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showHeroPlayer, setShowHeroPlayer] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
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

  // Use IntersectionObserver to detect when hero is visible
  useEffect(() => {
    const heroSection = document.getElementById('hero')
    if (!heroSection) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show hero player when hero is visible, hide when not
        setShowHeroPlayer(entry.isIntersecting)
      },
      { threshold: 0.1 } // Trigger when 10% of hero is visible
    )

    observer.observe(heroSection)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    audioRef.current = new Audio(playlist[currentTrack].url)
    audioRef.current.loop = true
    audioRef.current.volume = 0.3

    const tooltipTimer = setTimeout(() => {
      setShowTooltip(false)
    }, 5000)

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
        audioRef.current.play().catch(() => setIsPlaying(false))
      }
    }
  }, [currentTrack])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && !isMuted) {
        audioRef.current.play().catch(() => setIsPlaying(false))
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

  const togglePlay = () => setIsPlaying(!isPlaying)
  const toggleMute = () => setIsMuted(!isMuted)
  const nextTrack = () => setCurrentTrack((prev) => (prev + 1) % playlist.length)
  const prevTrack = () => setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length)

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
      {/* Desktop: Always bottom-right, original size */}
      <div className="hidden lg:block fixed bottom-6 right-6 z-50">
        {showTooltip && (
          <div className="absolute bottom-full right-0 mb-3 glass-card-strong px-4 py-2 rounded-xl whitespace-nowrap animate-bounce">
            <span className="text-sm text-frutiger-dark">Click to play Frutiger music!</span>
            <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white/30" />
          </div>
        )}
        
        {/* Original sized player */}
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

            <div className="flex items-end gap-0.5 h-6 flex-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 bg-frutiger-blue rounded-full transition-all duration-300 ${isPlaying && !isMuted ? 'animate-wave' : 'h-1'}`}
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

      {/* Mobile */}
      <div className="lg:hidden">
        {/* Hero player - slides out right when scrolling */}
        <div 
          className={`fixed bottom-6 right-6 z-50 transition-transform duration-500 ease-in-out ${
            showHeroPlayer ? 'translate-x-0' : 'translate-x-[150vw]'
          }`}
        >
          {/* Same original sized player */}
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

              <div className="flex items-end gap-0.5 h-6 flex-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-frutiger-blue rounded-full transition-all duration-300 ${isPlaying && !isMuted ? 'animate-wave' : 'h-1'}`}
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

        {/* Navbar bubble - appears when NOT in hero */}
        <div 
          className={`fixed top-4 right-16 z-50 transition-all duration-500 ease-in-out ${
            !showHeroPlayer ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'
          }`}
        >
          {/* Expanded popup - original size */}
          {isExpanded && (
            <div className="absolute top-full right-0 mt-2 w-[280px]">
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
                        className={`w-1 bg-frutiger-blue rounded-full transition-all duration-300 ${isPlaying && !isMuted ? 'animate-wave' : 'h-1'}`}
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
          )}

          {/* Small circle button */}
          <button
            ref={bubbleRef}
            onClick={() => setIsExpanded(!isExpanded)}
            className="relative w-10 h-10 glass-card-strong rounded-full flex items-center justify-center active:scale-95 transition-transform"
          >
            {/* Progress ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(0, 168, 232, 0.2)" strokeWidth="2" />
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="#00a8e8"
                strokeWidth="2"
                strokeDasharray={`${isPlaying ? 75 : 0} 100`}
                className="transition-all duration-1000"
              />
            </svg>
            
            <Music className={`w-5 h-5 text-frutiger-dark relative z-10 ${isPlaying ? 'animate-pulse' : ''}`} />
            
            {isPlaying && !isExpanded && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-frutiger-cyan rounded-full animate-pulse border-2 border-white" />
            )}
          </button>
        </div>
      </div>
    </>
  )
}

export default MusicPlayer
