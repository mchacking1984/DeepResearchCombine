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

    const { inputs } = await request.json()

    if (!inputs || inputs.length < 2) {
      return Response.json(
        { error: 'At least 2 research inputs are required' },
        { status: 400 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-preview' })

    const sourcesText = inputs
      .map((input, i) => `=== SOURCE ${i + 1}: ${input.provider} ===\n\n${input.content}`)
      .join('\n\n---\n\n')

    const prompt = `You are an expert research synthesizer. Your task is to combine multiple deep research outputs from different AI models into a single, comprehensive, and coherent research document.

INSTRUCTIONS:
1. Analyze all sources and identify where they agree
2. When sources conflict, evaluate the evidence and note significant disagreements
3. Include unique valuable insights from each source
4. Create a well-structured document with clear sections
5. Start with an executive summary
6. Attribute unique claims to their source (e.g., "According to ChatGPT...")
7. Focus on quality and accuracy - do not fabricate information

SOURCES TO COMBINE:

${sourcesText}

---

Please provide the combined research output below:`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    return Response.json({ result: text })
  } catch (err) {
    console.error('Error:', err)
    return Response.json(
      { error: err.message || 'Failed to combine research' },
      { status: 500 }
    )
  }
}
