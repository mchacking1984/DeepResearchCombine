export const metadata = {
  title: 'Deep Research Combine',
  description: 'Combine deep research from multiple LLM providers',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        padding: '40px 20px',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#0a0a0a',
        color: '#fff',
        minHeight: '100vh'
      }}>
        {children}
      </body>
    </html>
  )
}
