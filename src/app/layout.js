export const metadata = {
  title: 'Joke Generator',
  description: 'Generate jokes using Gemini AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        padding: '40px',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#111',
        color: '#fff',
        minHeight: '100vh'
      }}>
        {children}
      </body>
    </html>
  )
}
