import OpenAI from 'openai'

const openai = new OpenAI()

export async function POST(req: Request) {
  const { text } = await req.json()

  // Use "onyx" voice - deeper, more gravelly tone reminiscent of Dylan's aged voice
  const mp3 = await openai.audio.speech.create({
    model: 'tts-1-hd',
    voice: 'onyx',
    input: text,
    speed: 0.85, // Slower, more contemplative pace like Dylan's spoken word
  })

  const buffer = Buffer.from(await mp3.arrayBuffer())

  return new Response(buffer, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': buffer.length.toString(),
    },
  })
}
