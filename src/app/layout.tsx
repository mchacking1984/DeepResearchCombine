import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deep Research Combine",
  description: "Combine deep research outputs from multiple LLM providers into a unified, coherent result",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
