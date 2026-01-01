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
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = buildCombinePrompt(inputs);

    // Use streaming for better UX
    const result = await model.generateContentStream(prompt);

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
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error:", error);
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

  return `You are an expert research synthesizer. Combine the following research outputs into a single, comprehensive document.

## Instructions:
1. Identify where sources agree
2. Resolve conflicts by preferring consensus
3. Include unique insights from each source
4. Create a well-structured document with executive summary
5. Note source attribution for unique claims

## Sources:

${sourcesSection}

---

## Combined Research Output:

Synthesize the above into a coherent research document.`;
}
