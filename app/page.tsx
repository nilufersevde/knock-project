'use client'

import { useState, useCallback } from 'react'
import { HeroSection } from '@/components/hero-section'
import { ReflectionForm } from '@/components/reflection-form'
import { PoetryDisplay } from '@/components/poetry-display'
import { useAmbientAudio } from '@/components/audio-provider'
import { Volume2, VolumeX, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

type AppState = 'hero' | 'reflect' | 'result'

export default function KnockPage() {
  const [appState, setAppState] = useState<AppState>('hero')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [poetry, setPoetry] = useState('')
  const [reflection, setReflection] = useState('')
 
  const { isPlaying, isMuted, toggleMute, stopAmbient } = useAmbientAudio()

  const handleEnter = useCallback(() => {
    setAppState('reflect')
  }, [])

  const handleReflectionSubmit = useCallback(async (userReflection: string) => {
    setIsLoading(true)
    setPoetry('')
    setReflection(userReflection)

    try {

      // Move to result state
      setAppState('result')
      setIsLoading(false)
      setIsStreaming(true)

      // Then, generate poetry with streaming
      const poetryResponse = await fetch('/api/generate-poetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reflection: userReflection,
          
        }),
      })

      if (!poetryResponse.ok) {
        throw new Error('Poetry generation failed')
      }

      const reader = poetryResponse.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let accumulatedPoetry = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const chunk = decoder.decode(value)
          accumulatedPoetry += chunk
          setPoetry(accumulatedPoetry)
        }
      }

      setIsStreaming(false)
    } catch (error) {
      console.error('[v0] Error in generation:', error)
      setIsLoading(false)
      setIsStreaming(false)
    }
  }, [])

  const handleReset = useCallback(() => {
  setAppState('reflect')
  setPoetry('')
  setReflection('')
}, [])

const handleBackToHome = useCallback(() => {
  setAppState('hero')
  setPoetry('')
  setReflection('')
  setIsLoading(false)
  setIsStreaming(false)
  stopAmbient()
}, [stopAmbient])

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Floating buttons - only visible after entering experience */}
      {appState !== 'hero' && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          {/* Home button */}
          <Button
            onClick={handleBackToHome}
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-card hover:border-primary/50 transition-all duration-300"
            aria-label="Back to home"
          >
            <Home className="w-5 h-5 text-muted-foreground hover:text-primary" />
          </Button>

          {/* Mute button - only visible when audio is playing */}
          {isPlaying && (
            <Button
              onClick={toggleMute}
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-card hover:border-primary/50 transition-all duration-300"
              aria-label={isMuted ? 'Unmute ambient music' : 'Mute ambient music'}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Volume2 className="w-5 h-5 text-primary" />
              )}
            </Button>
          )}
        </div>
      )}

      {appState === 'hero' && (
        <HeroSection onEnter={handleEnter} />
      )}

      {appState === 'reflect' && (
        <ReflectionForm onSubmit={handleReflectionSubmit} isLoading={isLoading} />
      )}

      {appState === 'result' && (
        <PoetryDisplay
          poetry={poetry}
          reflection={reflection}
          isStreaming={isStreaming}
          onReset={handleReset}
        />
      )}
    </main>
  )
}
