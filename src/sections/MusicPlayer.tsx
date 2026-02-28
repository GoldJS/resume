import { useState, useRef, useEffect } from 'react'
import { Music, Volume2, VolumeX, Play, Pause, SkipForward, SkipBack } from 'lucide-react'
import { gsap } from 'gsap'

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showTooltip, setShowTooltip] = useState(true)
  const [currentTrack, setCurrentTrack] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playerRef = useRef<HTMLDivElement>(null)

  // Playlist of tracks - replace these URLs with your actual music files
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

  useEffect(() => {
    // Initialize audio with first track
    audioRef.current = new Audio(playlist[currentTrack].url)
    audioRef.current.loop = true
    audioRef.current.volume = 0.3

    // Hide tooltip after 5 seconds
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

  // Handle track change
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

  useEffect(() => {
    gsap.fromTo(playerRef.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 3 }
    )
  }, [])

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

  return (
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
        {/* Track Info */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-frutiger-dark/70 font-medium">
            {currentTrack + 1} / {playlist.length}
          </span>
          <span className="text-xs text-frutiger-dark truncate max-w-[120px]">
            {playlist[currentTrack].title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Music Icon */}
          <div className={`p-2 rounded-xl bg-gradient-to-br from-frutiger-blue to-frutiger-cyan ${isPlaying ? 'animate-pulse' : ''}`}>
            <Music className="w-4 h-4 text-white" />
          </div>

          {/* Visualizer */}
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

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={prevTrack}
              className="p-1.5 hover:bg-white/20 rounded-xl transition-colors"
              aria-label="Previous track"
            >
              <SkipBack className="w-3 h-3 text-frutiger-dark" />
            </button>

            <button
              onClick={togglePlay}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-frutiger-dark" />
              ) : (
                <Play className="w-4 h-4 text-frutiger-dark" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-1.5 hover:bg-white/20 rounded-xl transition-colors"
              aria-label="Next track"
            >
              <SkipForward className="w-3 h-3 text-frutiger-dark" />
            </button>

            <button
              onClick={toggleMute}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors ml-1"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-frutiger-dark/50" />
              ) : (
                <Volume2 className="w-4 h-4 text-frutiger-dark" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MusicPlayer