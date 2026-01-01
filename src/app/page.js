'use client'

import { useState } from 'react'

const providers = [
  { id: 'chatgpt', name: 'ChatGPT', color: '#10a37f' },
  { id: 'gemini', name: 'Gemini', color: '#4285f4' },
  { id: 'claude', name: 'Claude', color: '#d97706' },
  { id: 'deepseek', name: 'DeepSeek', color: '#8b5cf6' },
  { id: 'qwen', name: 'Qwen', color: '#ef4444' },
]

export default function Home() {
  const [inputs, setInputs] = useState({})
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (id, value) => {
    setInputs(prev => ({ ...prev, [id]: value }))
  }

  const filledCount = Object.values(inputs).filter(v => v?.trim()).length

  const handleCombine = async () => {
    setLoading(true)
    setError('')
    setOutput('')

    const filledInputs = providers
      .filter(p => inputs[p.id]?.trim())
      .map(p => ({ provider: p.name, content: inputs[p.id].trim() }))

    try {
      const res = await fetch('/api/combine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: filledInputs })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
      } else {
        setOutput(data.result)
      }
    } catch (err) {
      setError('Failed to connect to API')
    } finally {
      setLoading(false)
    }
  }

  const textareaStyle = (color) => ({
    width: '100%',
    minHeight: '150px',
    padding: '12px',
    fontSize: '14px',
    border: `2px solid ${color}40`,
    borderRadius: '8px',
    backgroundColor: '#111',
    color: '#fff',
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  })

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>
        Deep Research Combine
      </h1>
      <p style={{ color: '#888', marginBottom: '2rem', textAlign: 'center' }}>
        Paste deep research from 2 or more providers to combine them into a unified output
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {providers.map(p => (
          <div key={p.id}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
              fontWeight: '600'
            }}>
              <span style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: p.color
              }} />
              {p.name}
              {inputs[p.id]?.trim() && (
                <span style={{ color: '#10b981', fontSize: '12px', marginLeft: 'auto' }}>
                  ✓ Added
                </span>
              )}
            </label>
            <textarea
              placeholder={`Paste ${p.name} research here...`}
              value={inputs[p.id] || ''}
              onChange={(e) => handleChange(p.id, e.target.value)}
              style={textareaStyle(p.color)}
            />
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button
          onClick={handleCombine}
          disabled={loading || filledCount < 2}
          style={{
            padding: '14px 32px',
            fontSize: '1rem',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: loading || filledCount < 2 ? '#333' : '#4285f4',
            color: loading || filledCount < 2 ? '#666' : '#fff',
            cursor: loading || filledCount < 2 ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Combining...' : `Combine Research (${filledCount}/5 sources)`}
        </button>
      </div>

      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#2a1515',
          borderRadius: '8px',
          color: '#f88',
          marginBottom: '1rem'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {output && (
        <div style={{
          backgroundColor: '#111',
          border: '1px solid #333',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#1a1a1a',
            borderBottom: '1px solid #333',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <strong>Combined Research Output</strong>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              style={{
                padding: '6px 12px',
                fontSize: '13px',
                border: '1px solid #444',
                borderRadius: '4px',
                backgroundColor: '#222',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              Copy
            </button>
          </div>
          <div style={{
            padding: '1.5rem',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.7',
            maxHeight: '600px',
            overflow: 'auto'
          }}>
            {output}
          </div>
        </div>
      )}
    </div>
  )
}
