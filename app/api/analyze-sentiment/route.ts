import { generateText, Output } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

const SentimentSchema = z.object({
  primaryEmotion: z.enum(['grief', 'hope', 'resignation', 'peace', 'longing', 'release', 'weariness', 'acceptance']),
  intensity: z.number().min(0).max(1),
  thematicConnections: z.array(z.enum([
    'farewell',
    'transition', 
    'mortality',
    'legacy',
    'burden',
    'peace',
    'memory',
    'love'
  ])).max(3),
  doorMetaphor: z.string(),
  colorPalette: z.array(z.string()).length(3),
})

export async function POST(req: Request) {
  const { text } = await req.json()

  const result = await generateText({
    model: openai('gpt-4o-mini'),
    output: Output.object({ schema: SentimentSchema }),
    prompt: `Analyze this personal reflection in the context of Bob Dylan's "Knockin' on Heaven's Door" (1973).

HISTORICAL CONTEXT:
- The song was written during the Vietnam War era (1955-1975), when America lost 58,220 soldiers
- It was composed for "Pat Garrett & Billy the Kid," about a dying lawman laying down his badge
- The counterculture movement was transitioning from protest to mourning
- Themes: the weight of violence, the desire to lay down burdens, facing mortality, seeking peace

REFLECTION TO ANALYZE:
"${text}"

Determine:
1. The primary emotion (grief, hope, resignation, peace, longing, release, weariness, or acceptance)
2. The emotional intensity (0-1 scale)
3. Up to 3 thematic connections to the song and its historical era (farewell, transition, mortality, legacy, burden, peace, memory, love)
4. A brief, poetic metaphor about what "door" this person is knocking on - connect it to the Vietnam War era themes if relevant
5. A color palette (3 colors as hex codes) - use warm, muted 1970s film tones: ambers, sepias, olive greens, faded reds, dusty browns`,
  })

  return Response.json(result.output)
}
