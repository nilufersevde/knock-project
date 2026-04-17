'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useAmbientAudio } from '@/components/audio-provider'

interface HeroSectionProps {
  onEnter: () => void
}

export function HeroSection({ onEnter }: HeroSectionProps) {
  const [isReady, setIsReady] = useState(false)
  const { startAmbient } = useAmbientAudio()

  const handleEnter = useCallback(() => {
    startAmbient()
    onEnter()
  }, [startAmbient, onEnter])

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Full background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="A weathered door with light seeping through, 1970s aesthetic"
          fill
          className="object-cover"
          style={{ filter: 'brightness(0.7) contrast(1.1) sepia(0.15)' }}
          priority
        />
        {/* Film grain overlay */}
        <div 
          className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Subtle gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <AnimatePresence>
          {isReady && (
            <>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-primary tracking-[0.3em] uppercase text-xs mb-6 drop-shadow-md"
              >
                An AI Art Experience — 1973
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="font-serif text-6xl md:text-8xl lg:text-9xl font-light tracking-tight text-white mb-4 drop-shadow-lg"
              >
                KNOCK
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="font-serif text-xl md:text-2xl text-white/90 italic mb-8 drop-shadow-md"
              >
                At the Threshold
              </motion.p>

              

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="mb-12 border-l-2 border-primary/60 pl-6 py-4 text-left max-w-md mx-auto bg-black/30 backdrop-blur-sm rounded-r-sm"
              >
                <p className="text-white/95 leading-relaxed font-serif italic text-lg drop-shadow-sm">
                  &quot;Mama, take this badge off of me
                  <br />
                  I can&apos;t use it anymore
                  <br />
                  It&apos;s gettin&apos; dark, too dark to see
                  <br />
                  I feel I&apos;m knockin&apos; on heaven&apos;s door&quot;
                </p>
                <p className="text-xs mt-4 text-white/70 tracking-wide">
                  — Bob Dylan, Pat Garrett &amp; Billy the Kid, 1973
                </p>
              </motion.div>

              {/* Song description */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="mb-10 text-sm text-white/80 max-w-lg mx-auto"
              >
                <p className="italic">
                  A song about what we carry and what we finally let go.
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                onClick={handleEnter}
                className="group relative px-12 py-4 border-2 border-primary/70 hover:border-primary bg-black/40 hover:bg-black/50 backdrop-blur-sm transition-all duration-500 rounded-sm"
              >
                <span className="text-white tracking-[0.2em] uppercase text-sm font-medium drop-shadow-sm">
                  Enter the Experience
                </span>
              </motion.button>

              
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1, delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-muted-foreground/30 to-transparent" />
      </motion.div>
    </section>
  )
}
