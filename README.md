# Deep Research Combine

A web tool that combines deep research outputs from multiple LLM providers (ChatGPT, Gemini, Claude, DeepSeek, Qwen) into a unified, coherent research document using Google's Gemini 2.5 Pro model.

## Features

- **Multi-Source Input**: Paste research from up to 5 different LLM providers
- **Intelligent Synthesis**: Uses Gemini 2.5 Pro to intelligently merge and synthesize research
- **Streaming Output**: Real-time streaming of the combined research as it's generated
- **Markdown Rendering**: Beautiful rendering of the combined output with full markdown support
- **Copy to Clipboard**: Easy one-click copying of the final output

## How It Works

1. Run deep research queries on the same topic across multiple AI providers
2. Paste each research output into the corresponding text box
3. Click "Combine Research" to merge them
4. The tool uses Gemini's reasoning capabilities to:
   - Identify common themes and facts across sources
   - Resolve contradictions intelligently
   - Synthesize unique insights from each source
   - Create a well-structured, coherent document

## Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Local Development

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd deep-research-combine
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```

4. Add your Gemini API key to `.env.local`:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

### Deploy to Vercel

1. Push this repository to GitHub
2. Import the project in Vercel
3. Add the `GEMINI_API_KEY` environment variable in Vercel's project settings
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Model**: Google Gemini 2.5 Pro
- **Deployment**: Vercel

## License

MIT
