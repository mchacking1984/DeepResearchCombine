"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface Provider {
  id: string;
  name: string;
  color: string;
  placeholder: string;
}

const providers: Provider[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    color: "border-green-500",
    placeholder: "Paste ChatGPT deep research output here...",
  },
  {
    id: "gemini",
    name: "Gemini",
    color: "border-blue-500",
    placeholder: "Paste Gemini deep research output here...",
  },
  {
    id: "claude",
    name: "Claude",
    color: "border-orange-500",
    placeholder: "Paste Claude deep research output here...",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    color: "border-purple-500",
    placeholder: "Paste DeepSeek deep research output here...",
  },
  {
    id: "qwen",
    name: "Qwen",
    color: "border-red-500",
    placeholder: "Paste Qwen deep research output here...",
  },
];

export default function Home() {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (providerId: string, value: string) => {
    setInputs((prev) => ({ ...prev, [providerId]: value }));
  };

  const getFilledInputsCount = () => {
    return Object.values(inputs).filter((v) => v.trim().length > 0).length;
  };

  const handleCombine = async () => {
    const filledInputs = Object.entries(inputs)
      .filter(([, value]) => value.trim().length > 0)
      .map(([key, value]) => ({
        provider: providers.find((p) => p.id === key)?.name || key,
        content: value.trim(),
      }));

    if (filledInputs.length < 2) {
      setError("Please provide research from at least 2 providers");
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutput("");

    try {
      const response = await fetch("/api/combine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: filledInputs }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to combine research");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setOutput((prev) => prev + chunk);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputs({});
    setOutput("");
    setError(null);
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Deep Research Combine
          </h1>
          <p className="text-gray-400 text-lg">
            Merge deep research from multiple LLM providers into a unified,
            coherent output
          </p>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {providers.map((provider) => (
            <div key={provider.id} className="flex flex-col">
              <label
                htmlFor={provider.id}
                className={`text-sm font-medium mb-2 flex items-center gap-2`}
              >
                <span
                  className={`w-3 h-3 rounded-full ${provider.color.replace(
                    "border",
                    "bg"
                  )}`}
                ></span>
                {provider.name}
                {inputs[provider.id]?.trim() && (
                  <span className="text-xs text-green-400 ml-auto">
                    ✓ Content added
                  </span>
                )}
              </label>
              <textarea
                id={provider.id}
                className={`flex-1 min-h-[200px] p-3 bg-gray-900 border-2 ${provider.color} rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-y text-sm`}
                placeholder={provider.placeholder}
                value={inputs[provider.id] || ""}
                onChange={(e) => handleInputChange(provider.id, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            onClick={handleCombine}
            disabled={isLoading || getFilledInputsCount() < 2}
            className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all ${
              isLoading || getFilledInputsCount() < 2
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Combining...
              </span>
            ) : (
              `Combine Research (${getFilledInputsCount()}/5 sources)`
            )}
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-3 rounded-lg font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all"
          >
            Clear All
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Output Section */}
        {(output || isLoading) && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
              <h2 className="text-lg font-semibold">Combined Research Output</h2>
              {output && (
                <button
                  onClick={handleCopyOutput}
                  className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                >
                  Copy to Clipboard
                </button>
              )}
            </div>
            <div className="p-6 max-h-[600px] overflow-y-auto">
              {output ? (
                <div className="markdown-output prose prose-invert max-w-none">
                  <ReactMarkdown>{output}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex items-center justify-center py-12 text-gray-400">
                  <svg
                    className="animate-spin h-8 w-8 mr-3"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating combined research...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        {!output && !isLoading && (
          <div className="mt-8 p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">How to use:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-400">
              <li>
                Run deep research queries on the same topic across multiple LLM
                providers
              </li>
              <li>
                Copy and paste each research output into the corresponding text
                box above
              </li>
              <li>
                Select at least 2 providers (more sources = better combined
                output)
              </li>
              <li>
                Click &quot;Combine Research&quot; to merge them using Gemini&apos;s
                reasoning model
              </li>
              <li>
                The combined output will synthesize insights from all sources
                into a coherent document
              </li>
            </ol>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Powered by Google Gemini 2.5 Pro</p>
        </footer>
      </div>
    </main>
  );
}
