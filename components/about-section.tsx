'use client'

import { motion } from 'framer-motion'

export function AboutSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            About This Project
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            KNOCK is an AI-powered art experience that explores the themes of Bob Dylan&apos;s 
            1973 masterpiece &quot;Knockin&apos; on Heaven&apos;s Door&quot; through generative technology.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-serif text-xl text-foreground mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-primary/50" />
              Technical Architecture
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <span className="text-primary/80">AI Technique 1: Sentiment Analysis</span>
                <br />
                Your reflection is analyzed to extract emotional tone, thematic connections 
                to the song&apos;s core themes, and a personalized &quot;door&quot; metaphor that captures 
                your unique relationship with the material.
              </p>
              <p>
                <span className="text-primary/80">AI Technique 2: LLM Poetry Generation</span>
                <br />
                Using the emotional context from analysis, a large language model generates 
                original poetry in the style of Dylan circa 1973 — raw, honest, and deeply 
                connected to the counterculture spirit of that era.
              </p>
              <p>
                <span className="text-primary/80">AI Technique 3: Text-to-Speech Narration</span>
                <br />
                Your generated poetry can be narrated aloud using AI voice synthesis, 
                bringing the words to life with a contemplative, measured delivery that 
                evokes Dylan&apos;s own spoken word performances. Words highlight in sync 
                with the narration for an immersive experience.
              </p>
              <p>
                <span className="text-primary/80">AI Technique 4: Image Generation</span>
                <br />
                DALL-E 3 creates a unique 1970s-style visual atmosphere based on your 
                poetry and emotional analysis — grainy, sepia-toned imagery that evokes 
                the Vietnam War era and serves as a backdrop to your words.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-serif text-xl text-foreground mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-primary/50" />
              Artistic Vision
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                This is not a technical demonstration. It is an invitation to engage 
                with one of the most profound meditations on mortality and transition 
                ever written.
              </p>
              <p>
                The AI serves not as a replacement for human creativity, but as a 
                collaborator — a mirror that reflects your own thoughts through the 
                lens of Dylan&apos;s timeless themes.
              </p>
              <p className="italic text-muted-foreground/70">
                &quot;What matters is not what you find behind it, but who you discover 
                yourself to be while knocking.&quot;
              </p>
            </div>
          </motion.div>
        </div>

        {/* Technical stack */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 pt-8 border-t border-border/30"
        >
          <h3 className="text-xs text-muted-foreground/60 uppercase tracking-wider mb-6 text-center">
            Built With
          </h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {[
              'Next.js',
              'TypeScript',
              'AI SDK',
              'OpenAI GPT-4',
              'OpenAI TTS',
              'DALL-E 3',
              'Framer Motion',
              'Tailwind CSS',
            ].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-card/50 border border-border/30 rounded-sm text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
