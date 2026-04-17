'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function ContextSection() {
  const contextItems = [
    {
      year: '1973',
      title: 'The Song',
      description: 'Bob Dylan wrote "Knockin\' on Heaven\'s Door" for Sam Peckinpah\'s revisionist Western "Pat Garrett & Billy the Kid." The song captures Sheriff Colin Baker\'s final moments — a lawman dying from gunshot wounds, asking to be relieved of his badge and gun. Dylan stripped away everything but the essentials: a simple chord progression, a haunting melody, and words that cut to the heart of mortality.',
      image: '/images/counterculture.jpg',
      imageAlt: 'Acoustic guitar against wooden wall, 1970s folk music aesthetic',
    },
    {
      year: '1955-1975',
      title: 'The Vietnam War',
      description: 'America\'s longest and most divisive war claimed over 58,000 American lives and an estimated 2 million Vietnamese. By 1973, the Paris Peace Accords were signed, but the wounds ran deep. A generation came of age watching body counts on the evening news. The counterculture movement that began in protest had matured into something more contemplative — less rage, more meditation on collective loss and the moral weight of violence.',
      image: '/images/vietnam-era.jpg',
      imageAlt: 'Silhouettes of soldiers in mist, Vietnam War era photography',
    },
    {
      year: '1960s-70s',
      title: 'The Peace Movement',
      description: 'From the March on Washington to the Moratorium to End the War in Vietnam, millions gathered in candlelit vigils and protests. Young people burned draft cards, fled to Canada, or returned home forever changed. Dylan himself had been the voice of protest with "Blowin\' in the Wind" and "The Times They Are A-Changin\'" — but by 1973, he too had moved from anger to elegy, from protest to prayer.',
      image: '/images/peace-movement.jpg',
      imageAlt: 'Candlelight vigil, 1970s peace movement',
    },
    {
      year: 'Timeless',
      title: 'The Theme',
      description: 'At its heart, the song transcends its origins. It\'s about laying down burdens — the badge, the gun, the roles that defined us — and facing the threshold between what was and what comes next. It speaks to every soldier who returned home unable to be who they were before, every person facing their own mortality, every moment of surrender that precedes transformation. The door is always there, waiting.',
    },
  ]

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-primary/60 tracking-[0.3em] uppercase text-xs mb-4">
            Understanding the Era
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">
            Historical Context
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            To truly understand &quot;Knockin&apos; on Heaven&apos;s Door,&quot; we must understand 
            the world that gave birth to it — a nation divided by war, a generation 
            searching for meaning in the face of loss.
          </p>
        </motion.div>

        <div className="space-y-20">
          {contextItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
            >
              {/* Image */}
              {item.image && (
                <div className="w-full md:w-2/5 shrink-0">
                  <div className="relative aspect-[4/3] rounded overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.imageAlt || ''}
                      fill
                      loading={index === 0 ? 'eager' : 'lazy'}
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                    {/* Film grain overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                    <div 
                      className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                      }}
                    />
                  </div>
                </div>
              )}
              
              {/* Content */}
              <div className={`flex-1 ${!item.image ? 'text-center max-w-2xl mx-auto' : ''}`}>
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-serif text-3xl md:text-4xl text-primary">
                    {item.year}
                  </span>
                  <div className="h-px flex-1 bg-border/50" />
                </div>
                <h3 className="font-serif text-2xl text-foreground mb-4">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Vietnam War Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 pt-12 border-t border-border/30"
        >
          <p className="text-center text-xs text-muted-foreground/50 tracking-[0.2em] uppercase mb-8">
            The Cost of War
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '58,220', label: 'American Lives Lost' },
              { number: '2M+', label: 'Vietnamese Deaths (Est.)' },
              { number: '303,644', label: 'Americans Wounded' },
              { number: '1,584', label: 'Still Missing (POW/MIA)' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <p className="font-serif text-3xl md:text-4xl text-primary mb-2">{stat.number}</p>
                <p className="text-xs text-muted-foreground/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
