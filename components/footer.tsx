'use client'

import { motion } from 'framer-motion'

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="font-serif text-2xl text-foreground mb-4">
            KNOCK
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            An AI art exploration of &quot;Knockin&apos; on Heaven&apos;s Door&quot; (1973)
          </p>
          <div className="flex justify-center gap-4 text-xs text-muted-foreground/60">
            <span>CSE 358 Creative Project</span>
            <span>•</span>
            <span>Spring 2025-2026</span>
          </div>
          <p className="mt-8 text-xs text-muted-foreground/40">
            &quot;Knock. The door is yours to design. What&apos;s behind it is yours to discover.&quot;
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
