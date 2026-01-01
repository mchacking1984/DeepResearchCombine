import { GoogleGenAI } from "@google/genai";

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json({
        success: false,
        error: "GEMINI_API_KEY not set",
        keyLength: 0,
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Simple test call
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Say hello in one word.",
    });

    return Response.json({
      success: true,
      keyLength: apiKey.length,
      keyPrefix: apiKey.substring(0, 8) + "...",
      response: response.text,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      errorName: error instanceof Error ? error.name : "Unknown",
      errorStack: error instanceof Error ? error.stack?.split("\n").slice(0, 3) : [],
    });
  }
}
