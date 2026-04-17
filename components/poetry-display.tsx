'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX, Loader2, RotateCcw } from 'lucide-react'
import Image from 'next/image'
import { useAmbientAudio } from '@/components/audio-provider'

interface SentimentAnalysis {
  primaryEmotion: string
  intensity: number
  thematicConnections: string[]
  doorMetaphor: string
  colorPalette: string[]
}

interface PoetryDisplayProps {
  poetry: string
  reflection: string
  sentiment: SentimentAnalysis | null
  isStreaming: boolean
  onReset: () => void
}

export function PoetryDisplay({ poetry, reflection, sentiment, isStreaming, onReset }: PoetryDisplayProps) {
  const [isNarrating, setIsNarrating] = useState(false)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [imageTitle, setImageTitle] = useState<string | null>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [audioDuration, setAudioDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef<string | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const highlightStartTimeRef = useRef<number>(0)
  
  // Global ambient audio controls
  const { lowerAmbient, raiseAmbient } = useAmbientAudio()

  // Split poetry into words for highlighting
  const words = poetry.split(/(\s+)/).filter(Boolean)
  const spokenWords = words.filter(w => w.trim().length > 0)

  // Generate image when poetry is complete
  const shouldGenerateImage = !isStreaming && poetry && sentiment && !generatedImage && !isGeneratingImage
  
  useEffect(() => {
    if (shouldGenerateImage) {
      generateImage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldGenerateImage])

  const generateImage = async () => {
    setIsGeneratingImage(true)
    setImageError(false)
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poetry, reflection, sentiment }),
      })

      if (!response.ok) throw new Error('Failed to generate image')

      const data = await response.json()
      setGeneratedImage(data.imageUrl)
      if (data.title) setImageTitle(data.title)
    } catch (error) {
      console.error('Image generation error:', error)
      setImageError(true)
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // Improved word timing with better synchronization
  const startWordHighlighting = useCallback((audio: HTMLAudioElement, duration: number) => {
    // Use actual duration with a small buffer for natural feel
    const effectiveDuration = duration > 0 ? duration : 15
    
    highlightStartTimeRef.current = Date.now()
    
    const updateHighlight = () => {
      if (audio.paused || audio.ended) {
        return
      }
      
      const currentTime = audio.currentTime
      // Add slight delay to account for audio processing latency
      const adjustedTime = Math.max(0, currentTime - 0.1)
      const progress = adjustedTime / effectiveDuration
      const estimatedWordIndex = Math.floor(progress * spokenWords.length)
      
      setCurrentWordIndex(Math.min(estimatedWordIndex, spokenWords.length - 1))
      
      animationFrameRef.current = requestAnimationFrame(updateHighlight)
    }
    
    animationFrameRef.current = requestAnimationFrame(updateHighlight)
  }, [spokenWords.length])

  const stopWordHighlighting = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    setCurrentWordIndex(-1)
    
    // Raise ambient audio back to normal volume
    raiseAmbient()
  }, [raiseAmbient])

  const handleNarrate = async () => {
    // If already narrating, stop
    if (isNarrating && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsNarrating(false)
      stopWordHighlighting()
      return
    }

    // If we already have the audio loaded, just play it
    if (audioUrlRef.current && audioRef.current) {
      // Lower ambient music for TTS
      lowerAmbient()
      
      audioRef.current.play()
      setIsNarrating(true)
      startWordHighlighting(audioRef.current, audioDuration)
      return
    }

    // Generate new audio
    setIsLoadingAudio(true)
    
    // Lower ambient music immediately when starting narration
    lowerAmbient()
    
    try {
      const response = await fetch('/api/narrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: poetry }),
      })

      if (!response.ok) throw new Error('Failed to generate narration')

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      audioUrlRef.current = audioUrl

      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onloadedmetadata = () => {
        setAudioDuration(audio.duration)
        startWordHighlighting(audio, audio.duration)
      }

      audio.onended = () => {
        setIsNarrating(false)
        stopWordHighlighting()
      }
      audio.onpause = () => {
        setIsNarrating(false)
        stopWordHighlighting()
      }
      audio.onplay = () => {
        setIsNarrating(true)
      }

      await audio.play()
    } catch (error) {
      console.error('Narration error:', error)
      // Raise ambient back if narration failed
      raiseAmbient()
    } finally {
      setIsLoadingAudio(false)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWordHighlighting()
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current)
      }
    }
  }, [stopWordHighlighting])

  // Render poetry with word highlighting
  const renderHighlightedPoetry = () => {
    let wordCounter = -1
    
    return words.map((word, index) => {
      const isWhitespace = word.trim().length === 0
      
      if (!isWhitespace) {
        wordCounter++
      }
      
      const isCurrentWord = !isWhitespace && wordCounter === currentWordIndex
      const isPastWord = !isWhitespace && wordCounter < currentWordIndex
      
      if (isWhitespace) {
        // Preserve line breaks and spaces
        if (word.includes('\n')) {
          return <br key={index} />
        }
        return <span key={index}>{word}</span>
      }
      
      return (
        <span
          key={index}
          className={`transition-all duration-300 ease-out inline-block ${
            isCurrentWord 
              ? 'text-primary scale-105 drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]' 
              : isPastWord 
                ? 'text-foreground/80' 
                : isNarrating 
                  ? 'text-foreground/30' 
                  : 'text-foreground'
          }`}
          style={{
            textShadow: isCurrentWord ? '0 0 20px currentColor' : 'none',
          }}
        >
          {word}
        </span>
      )
    })
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen relative overflow-hidden"
    >
      {/* Stock 1970s background — visible while AI image generates */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/stock-1970s.jpg"
          alt="1970s atmospheric scene"
          fill
          className="object-cover"
          style={{ filter: 'brightness(0.95) contrast(1.0) sepia(0.08)' }}
          priority
        />
        {/* Only a thin bottom gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
      </div>

      {/* AI generated image fades in on top */}
      <AnimatePresence>
        {generatedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5, ease: 'easeOut' }}
            className="fixed inset-0 z-[1]"
          >
            <Image
              src={generatedImage}
              alt="AI generated scene inspired by your reflection"
              fill
              className="object-cover"
              style={{ filter: 'brightness(0.95) contrast(1.0) sepia(0.08)' }}
              priority
              unoptimized
            />
            {/* Only bottom gradient — let the image breathe */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image generation loading indicator - positioned in corner so stock image stays visible */}
      <AnimatePresence>
        {isGeneratingImage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-card/80 backdrop-blur-md border border-border/40 rounded-sm px-5 py-3 shadow-lg"
          >
            <div className="relative w-5 h-5">
              <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
              <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-sm text-white/90 tracking-wide">
              Generating visual...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      

      {/* Main content with proper spacing from fixed backgrounds */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">

      <div className="max-w-xl w-full relative z-10">
        {/* Poetry display with word highlighting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center mb-16"
        >
          <div className="relative bg-black/10 backdrop-blur-[2px] rounded-sm p-6 md:p-8 border border-white/5">
            <div className="absolute -left-2 top-4 text-6xl text-primary/40 font-serif">
              &ldquo;
            </div>
            <p className="font-serif text-xl md:text-2xl text-white leading-loose px-4 drop-shadow-md">
              {isStreaming ? (
                <>
                  {poetry}
                  <span className="inline-block w-0.5 h-6 bg-primary ml-1 animate-typing-cursor" />
                </>
              ) : (
                renderHighlightedPoetry()
              )}
            </p>
            <div className="absolute -right-2 bottom-4 text-6xl text-primary/20 font-serif">
              &rdquo;
            </div>
          </div>
        </motion.div>

        {/* Attribution + image title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mb-12 space-y-1"
        >
          {imageTitle && (
            <p className="text-xs text-primary/70 uppercase tracking-widest drop-shadow-sm">
              {imageTitle}
            </p>
          )}
          <p className="text-sm text-white/40 italic drop-shadow-sm">
            In the spirit of Dylan, 1973
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex justify-center gap-4 flex-wrap"
        >
          {/* Narration Button */}
          <Button
            onClick={handleNarrate}
            disabled={isStreaming || isLoadingAudio}
            variant="default"
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            {isLoadingAudio ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Voice...
              </>
            ) : isNarrating ? (
              <>
                <VolumeX className="w-4 h-4" />
                Stop Narration
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                Hear It Narrated
              </>
            )}
          </Button>

          <Button
            onClick={onReset}
            variant="outline"
            className="border-border/50 hover:border-primary/50 text-muted-foreground hover:text-foreground gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reflect Again
          </Button>
        </motion.div>


      </div>
      </div>
    </motion.section>
  )
}
