'use client'

import { createContext, useContext, useRef, useCallback, useState, useEffect, type ReactNode } from 'react'

interface AudioContextType {
  startAmbient: () => void
  stopAmbient: () => void
  lowerAmbient: () => void
  raiseAmbient: () => void
  toggleMute: () => void
  isPlaying: boolean
  isMuted: boolean
}

const AudioContext = createContext<AudioContextType | null>(null)

// Bob Dylan - Main Title Theme (Billy) from Pat Garrett & Billy the Kid (1973)
const DYLAN_AMBIENT_URL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bob%20Dylan%20-%20Main%20Title%20Theme%20%28Billy%29%20%28Official%20Audio%29-eE8QkOEY0WsXf34kxZc2AFl1DJ7fF3.mp3'

const NORMAL_VOLUME = 0.35
const LOWERED_VOLUME = 0.08

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const volumeBeforeMuteRef = useRef<number>(NORMAL_VOLUME)
  const isMutedRef = useRef<boolean>(false) // Ref to track muted state for callbacks

  // Keep ref in sync with state
  useEffect(() => {
    isMutedRef.current = isMuted
  }, [isMuted])

  // Initialize audio on mount
  useEffect(() => {
    const audio = new Audio(DYLAN_AMBIENT_URL)
    audio.loop = true
    audio.volume = 0
    audio.crossOrigin = 'anonymous'
    audioRef.current = audio

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current)
      }
    }
  }, [])

  // Smooth volume fade function
  const fadeVolume = useCallback((targetVolume: number, duration: number) => {
    if (!audioRef.current) return

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current)
    }

    const audio = audioRef.current
    const startVolume = audio.volume
    const volumeDiff = targetVolume - startVolume
    const steps = 30
    const stepDuration = duration / steps
    let currentStep = 0

    fadeIntervalRef.current = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      // Ease out cubic for smooth fade
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      audio.volume = Math.max(0, Math.min(1, startVolume + volumeDiff * easeProgress))

      if (currentStep >= steps) {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current)
          fadeIntervalRef.current = null
        }
      }
    }, stepDuration)
  }, [])

  const startAmbient = useCallback(() => {
    if (!audioRef.current) return
    
    audioRef.current.currentTime = 0
    audioRef.current.volume = 0
    audioRef.current.play()
    setIsPlaying(true)
    fadeVolume(NORMAL_VOLUME, 2000) // Fade in over 2 seconds
  }, [fadeVolume])

  const stopAmbient = useCallback(() => {
    if (!audioRef.current) return

    fadeVolume(0, 1500)
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    }, 1500)
  }, [fadeVolume])

  const lowerAmbient = useCallback(() => {
    if (!audioRef.current || !isPlaying) return
    // Don't lower if already muted
    if (!isMutedRef.current) {
      fadeVolume(LOWERED_VOLUME, 800) // Lower over 0.8 seconds
    }
  }, [fadeVolume, isPlaying])

  const raiseAmbient = useCallback(() => {
    if (!audioRef.current || !isPlaying) return
    // Use ref to get current muted state (avoids stale closure)
    if (!isMutedRef.current) {
      fadeVolume(NORMAL_VOLUME, 1200) // Raise over 1.2 seconds
    }
  }, [fadeVolume, isPlaying])

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return

    if (isMuted) {
      // Unmute - restore previous volume
      fadeVolume(volumeBeforeMuteRef.current, 300)
      setIsMuted(false)
    } else {
      // Mute - save current volume and fade to 0
      volumeBeforeMuteRef.current = audioRef.current.volume || NORMAL_VOLUME
      fadeVolume(0, 300)
      setIsMuted(true)
    }
  }, [isMuted, fadeVolume])

  return (
    <AudioContext.Provider value={{ startAmbient, stopAmbient, lowerAmbient, raiseAmbient, toggleMute, isPlaying, isMuted }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAmbientAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAmbientAudio must be used within an AudioProvider')
  }
  return context
}
