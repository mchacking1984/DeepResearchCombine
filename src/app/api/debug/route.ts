export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  return Response.json({
    hasApiKey: !!apiKey,
    keyLength: apiKey?.length || 0,
    keyPrefix: apiKey ? apiKey.substring(0, 10) + "..." : "not set",
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
  });
}
