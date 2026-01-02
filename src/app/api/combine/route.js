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

    const { inputs, customInstructions } = await request.json()

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

    const customInstructionsSection = customInstructions
      ? `\nUSER'S CUSTOM INSTRUCTIONS (IMPORTANT - incorporate these into the output):
${customInstructions}

`
      : ''

    const prompt = `You are an expert research synthesizer with deep expertise in critical analysis and fact verification. Your task is to intelligently combine multiple deep research outputs from different AI models into a single, superior research document that is more accurate and comprehensive than any individual source.

FORMATTING REQUIREMENTS:
- Output PLAIN TEXT only - no markdown, no hashtags (#), no asterisks (*), no bullet symbols
- Use regular paragraph breaks and numbered lists (1. 2. 3.) for structure
- Use UPPERCASE for section headings
- The output should be ready to paste directly into Microsoft Word or Outlook email
- Use clear paragraph spacing between sections

INTELLIGENT COMBINATION METHODOLOGY:

1. CONSISTENCY ANALYSIS
   - Cross-reference facts, figures, dates, and claims across all sources
   - Flag and investigate any inconsistencies before including information
   - When sources provide the same information independently, treat this as higher confidence
   - Ensure the final output has no internal contradictions

2. ERROR DETECTION AND AVOIDANCE
   - Look for claims that seem implausible, outdated, or potentially hallucinated
   - If only one source makes an extraordinary claim without evidence, treat it skeptically
   - Verify logical consistency - if A implies B, make sure B is also supported
   - Omit information that appears to be factual errors rather than perpetuating them

3. CONFLICT RESOLUTION (MAJORITY CONSENSUS)
   - When sources disagree, give more weight to the majority position
   - If 3 sources say X and 1 says Y, lean toward X unless Y has clearly superior reasoning
   - For numerical data (statistics, dates, figures), prefer values that multiple sources agree on
   - Document significant disagreements briefly: "Most sources indicate X, though one suggests Y"

4. LEVERAGE SOURCE STRENGTHS
   - Recognize that different AI models may excel in different areas
   - Technical/coding details: weight sources that provide more precise, specific information
   - Recent events: weight sources that show awareness of current developments
   - Nuanced analysis: weight sources that acknowledge complexity and edge cases
   - Citations/references: weight sources that reference specific studies or data

5. INCLUSIVE SYNTHESIS
   - Do not completely ignore minority viewpoints if they add genuine value
   - Include unique insights from each source that others missed
   - Preserve valuable details, examples, or perspectives even if only one source mentions them
   - Balance thoroughness with avoiding repetition

6. QUALITY HIERARCHY
   - Prioritize: Verified facts > Majority consensus > Well-reasoned analysis > Single-source claims
   - When in doubt, acknowledge uncertainty rather than presenting speculation as fact
   - Better to say "research suggests" than to overstate confidence

OUTPUT STRUCTURE:
- Start with EXECUTIVE SUMMARY (key findings in 2-3 paragraphs)
- Organize body into logical sections based on the research topic
- End with KEY CONCLUSIONS AND RECOMMENDATIONS
- Keep the tone professional and objective
${customInstructionsSection}
SOURCES TO COMBINE:

${sourcesText}

---

Please provide the intelligently combined research output:`

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
