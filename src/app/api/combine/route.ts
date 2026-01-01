import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

interface ResearchInput {
  provider: string;
  content: string;
}

interface RequestBody {
  inputs: ResearchInput[];
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const body: RequestBody = await request.json();
    const { inputs } = body;

    if (!inputs || inputs.length < 2) {
      return Response.json(
        { error: "At least 2 research inputs are required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Use Gemini 3 Pro - latest advanced reasoning model
    const model = genAI.getGenerativeModel({
      model: "gemini-3-pro-preview",
    });

    const prompt = buildCombinePrompt(inputs);

    // Use streaming for better UX with long outputs
    const result = await model.generateContentStream(prompt);

    // Create a readable stream from the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error combining research:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

function buildCombinePrompt(inputs: ResearchInput[]): string {
  const sourcesSection = inputs
    .map(
      (input, index) =>
        `## Source ${index + 1}: ${input.provider}\n\n${input.content}`
    )
    .join("\n\n---\n\n");

  return `You are an expert research synthesizer. Your task is to combine multiple deep research outputs from different AI models into a single, comprehensive, and coherent research document.

## Instructions:

1. **Analyze all sources**: Carefully read through each research output provided below.

2. **Identify commonalities**: Note where multiple sources agree on facts, conclusions, or recommendations.

3. **Resolve conflicts**: When sources contradict each other:
   - Evaluate which source provides better evidence or reasoning
   - Note the disagreement if it's significant
   - Prefer consensus when multiple sources agree over a single outlier

4. **Synthesize unique insights**: Include valuable unique information from each source that others may have missed.

5. **Maintain structure**: Create a well-organized document with:
   - Clear headings and subheadings
   - Logical flow of information
   - Executive summary at the beginning
   - Key findings and conclusions

6. **Preserve accuracy**: Do not fabricate information. Only include facts and insights present in the source materials.

7. **Note source attribution**: When presenting a unique insight or claim, briefly note which model(s) provided it (e.g., "According to ChatGPT..." or "Multiple sources confirm...").

8. **Quality over quantity**: Focus on the most important and reliable information rather than including everything.

## Source Research Outputs:

${sourcesSection}

---

## Your Combined Research Output:

Please synthesize the above research outputs into a single, comprehensive research document. Start with an executive summary, then organize the content into logical sections. Ensure the final output is coherent, well-structured, and represents the best insights from all sources.`;
}
