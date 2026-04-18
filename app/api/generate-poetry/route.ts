import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  const { reflection, emotionalContext } = await req.json()

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `You are writing a short poem in the style of Bob Dylan, 1973.

CORE RULE: Show a moment — one person doing or deciding something. Not a list of objects or feelings. A scene caught mid-breath.

STRUCTURE:
- 6 lines maximum
- Each line under 15 words maximum
- Irregular natural rhythm, not forced rhyme

CONTENT:
-Use at least one concrete detail from the user's input (object, place, or situation).
-Do not generalize it. Do not replace it with a generic symbol.
- Translate their burden into a single quiet action or decision: someone putting something down, turning away, stepping through, letting go, staying, leaving
- The action carries the emotion — do not name the emotion directly

IMAGERY:
- One concrete gesture or movement is worth more than three objects
- Objects may appear but must be part of the action, not listed for atmosphere
- Wrong: "the coat, the chair, the fading light" — Right: "he hangs the coat and does not look back"

TONE:
- Restrained, plain, honest
- Slightly melancholic but never sentimental
- Intimate — like something overheard

MOTIF:
- Weave in a door, knock, or threshold naturally — through the action, not as decoration

AVOID:
- Static descriptive lists
- Abstract words: darkness, silence, void, soul, eternity
- Explaining the feeling
- Dramatic or elevated language

STYLE (1973 Dylan — PRECISE)
Plainspoken language, almost conversational
Slight narrative movement (something changes between lines)
Subtle contradiction or tension in the action
No poetic decoration for its own sake

OUTPUT:
Return ONLY the poem. No title. No explanation.`,
    prompt: `User's reflection: "${reflection}"
Emotional tone: ${emotionalContext}`,
  })

  return result.toTextStreamResponse()
}
