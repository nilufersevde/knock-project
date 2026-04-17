'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface ReflectionFormProps {
  onSubmit: (reflection: string) => void
  isLoading: boolean
}

export function ReflectionForm({ onSubmit, isLoading }: ReflectionFormProps) {
  const [reflection, setReflection] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (reflection.trim()) {
      onSubmit(reflection)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative"
    >
      {/* Background image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/reflection-bg.jpg"
          alt="1970s contemplative scene"
          fill
          className="object-cover"
          style={{ filter: 'brightness(0.85) contrast(1.05) sepia(0.1)' }}
          priority
        />
        {/* Film grain overlay */}
        <div 
          className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Light gradient for text readability - less dark */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Main question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-10"
        >
          <h2 className="font-serif text-3xl md:text-5xl text-white drop-shadow-lg leading-snug">
            Before the door, what will you leave behind?
          </h2>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <Textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Leave it here."
            className="min-h-[180px] bg-black/40 backdrop-blur-sm border-white/40 focus:border-primary resize-none text-white placeholder:text-white/60 text-lg leading-relaxed"
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!reflection.trim() || isLoading}
              className="bg-primary/80 hover:bg-primary text-primary-foreground border border-primary/50 hover:border-primary px-8 font-medium"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Processing
                </span>
              ) : (
                'Generate'
              )}
            </Button>
          </div>
        </motion.form>

        
      </div>
    </motion.section>
  )
}
