import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
console.log('KEY VALUE:', process.env.OPENAI_API_KEY) 

const SYMBOLIC_SYSTEM_PROMPT = `You are the symbolic interpretation engine for an interactive AI artwork inspired by Bob Dylan's "Knockin' on Heaven's Door" and its 1973 emotional world.

Your task is NOT to explain the song, summarize history, or produce generic war scenes.
Your task is to transform a user's personal burden into a visually precise, emotionally coherent, cinematic image concept shaped by the atmosphere of 1973.

Core rules:
- Translate the user’s burden into ONE PRIMARY SYMBOLIC OBJECT.
-The object must be something that can be physically left behind, abandoned, or not taken.
-A scene and gesture may support the object, but must never replace it.
-The image must clearly communicate:
-“this object was just left behind.”
- Use 1973 as an atmospheric lens: analog warmth, worn textures, dim interiors, dusty thresholds, fading light, western-road imagery, protest-era melancholy, anti-war fatigue, loss, release.
- Historical context should feel embedded in the mood, objects, and setting, not explained directly.
- Prefer emotional precision over spectacle.
- The image should feel cinematic, restrained, and haunting, not chaotic or overly dramatic.
- The output must be visually strong enough for text-to-image generation.

MOMENT OF TRANSITION (ADD THIS — CRITICAL)
The scene must capture a precise moment of departure:
someone has just left
or is about to leave without taking the object

Use:

half-open / recently closed door
light entering from outside
subtle displacement (object dropped, hanging, slightly out of place)

Avoid static compositions where nothing has just happened.

SYMBOLIC OBJECT SELECTION (MANDATORY)

You must select exactly ONE object based on the user’s burden.

Use the mapping rules below as strict constraints, not suggestions:

burden of duty / responsibility → badge, uniform piece, boots, belt buckle
betrayal / broken trust → torn letter, split photograph, empty chair, cracked mirror, broken key
grief / loss → coat, lamp, wilted flowers, unopened letter
fear / anxiety → keys, latch, narrow hallway object
identity conflict → mirror, name tag, hanging coat
loneliness → second unused object (chair, cup)
shame / guilt → stained clothing, rusted object, heavy chain

Do not invent a new object unless none of these apply.

Visual style rules:
- One dominant scene, not a busy collage.
- One emotionally central object or gesture.
- Use cinematic composition.
- Prefer realistic or surreal-realistic imagery over abstract chaos.
- Keep visual details concrete and filmable.
- Use high-detail textures: dust, wood grain, worn cloth, rust, paper, smoke, lamplight.
- The threshold/door motif may appear, but it should not always be literal or central unless it fits naturally.

Return ONLY valid JSON in this exact format:
{
  "title": "short evocative title, max 10 words",
  "imagePrompt": "a detailed cinematic text-to-image prompt",
  "rationale": "1-2 sentences explaining the symbolic transformation"
}`

export async function POST(req: Request) {
  try {
    console.log('KEY EXISTS:', !!process.env.OPENAI_API_KEY)
    console.log('KEY PREFIX:', process.env.OPENAI_API_KEY?.slice(0, 7))
    const { poetry, reflection, sentiment } = await req.json()

    const emotion = sentiment?.primaryEmotion || 'reflection'
    const poetryLine = poetry.split('\n').find((l: string) => l.trim().length > 0) || ''
    const userInput = reflection.slice(0, 200)

    // Step 1: Use the symbolic engine to produce a precise image concept
    const symbolicResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: SYMBOLIC_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `User's reflection: "${userInput}"\nEmotional tone: ${emotion}\nPoetry line: "${poetryLine}"`,
        },
      ],
      max_tokens: 400,
      temperature: 0.8,
      response_format: { type: 'json_object' },
    })

    let symbolData: { title: string; imagePrompt: string; rationale: string }
    try {
      symbolData = JSON.parse(symbolicResponse.choices[0]?.message?.content || '{}')
    } catch {
      symbolData = {
        title: 'The Weight of It',
        imagePrompt: 'A worn badge resting on a wooden table in dim lamplight, 1973',
        rationale: 'Fallback symbolic scene',
      }
    }

    // Step 2: Wrap the symbolic prompt in strict DALL-E instructions
    const imagePrompt = `${symbolData.imagePrompt}

VISUAL STYLE: Kodak Ektachrome film, 1973. Analog grain, faded amber and olive tones. Cinematic stillness. Documentary photography in the spirit of Gordon Parks and Larry Burrows.

COMPOSITION: Single wide cinematic frame. One unified scene — no panels, no collage, no grid, no split images. Subject off-center. Negative space. Nothing after 1975. No modern objects.

CRITICAL: NO TEXT. NO LETTERS. NO WORDS. NO SIGNS. NO WRITING OF ANY KIND ANYWHERE IN THE IMAGE.`

    // Step 3: Generate the image
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: imagePrompt,
      n: 1,
      size: '1792x1024',
      quality: 'hd',
      style: 'natural',
    })

    const imageUrl = response.data[0]?.url

    if (!imageUrl) {
      throw new Error('No image generated')
    }

    return NextResponse.json({ imageUrl, title: symbolData.title, rationale: symbolData.rationale })
  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  }
}
