import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return Response.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const { topic } = await request.json()

    if (!topic) {
      return Response.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-preview' })

    const result = await model.generateContent(
      `Tell me a short, funny joke about: ${topic}. Just the joke, nothing else.`
    )

    const joke = result.response.text()

    return Response.json({ joke })
  } catch (err) {
    console.error('Error:', err)
    return Response.json(
      { error: err.message || 'Failed to generate joke' },
      { status: 500 }
    )
  }
}
