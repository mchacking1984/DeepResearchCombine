'use client'

import { useState } from 'react'

export default function Home() {
  const [topic, setTopic] = useState('')
  const [joke, setJoke] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateJoke = async () => {
    if (!topic.trim()) return

    setLoading(true)
    setError('')
    setJoke('')

    try {
      const res = await fetch('/api/joke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
      } else {
        setJoke(data.joke)
      }
    } catch (err) {
      setError('Failed to connect to API')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        Joke Generator
      </h1>
      <p style={{ color: '#888', marginBottom: '2rem' }}>
        Enter a topic and get a joke powered by Gemini AI
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && generateJoke()}
          placeholder="Enter a topic (e.g., cats, programming, coffee)"
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '1rem',
            border: '2px solid #333',
            borderRadius: '8px',
            backgroundColor: '#222',
            color: '#fff',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <button
        onClick={generateJoke}
        disabled={loading || !topic.trim()}
        style={{
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '8px',
          backgroundColor: loading || !topic.trim() ? '#444' : '#4285f4',
          color: '#fff',
          cursor: loading || !topic.trim() ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Generating...' : 'Generate Joke'}
      </button>

      {error && (
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#3a1a1a',
          borderRadius: '8px',
          color: '#f88'
        }}>
          {error}
        </div>
      )}

      {joke && (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: '#1a2a1a',
          borderRadius: '8px',
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          {joke}
        </div>
      )}
    </div>
  )
}
