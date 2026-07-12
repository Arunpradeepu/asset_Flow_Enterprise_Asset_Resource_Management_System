import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

const API = 'http://localhost:5000'

const EXAMPLES = [
  'Show me all assets under maintenance',
  'Which employees have no assets allocated?',
  'List all allocated laptops in the IT department',
  'How many assets are available?',
]

function AIQuery() {
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setAnswer('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/api/ai/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ query })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setAnswer(data.answer)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '4px' }}>AI Questioning</h1>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Ask anything about your assets, employees, or allocations.
      </p>

      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>Try asking:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setQuery(ex)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#374151',
                transition: 'all 0.2s'
              }}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Show me all electronics under maintenance in the IT department"
          rows={3}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '15px',
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: loading ? '#93c5fd' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '15px',
            whiteSpace: 'nowrap'
          }}
        >
          {loading ? '...' : 'Ask'}
        </button>
      </form>

      {error && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#dc2626',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{
          marginTop: '24px',
          padding: '20px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          color: '#94a3b8',
          fontStyle: 'italic'
        }}>
          Thinking...
        </div>
      )}

      {answer && !loading && (
        <div style={{
          marginTop: '24px',
          padding: '24px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          lineHeight: '1.7',
          fontSize: '15px'
        }}>
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>{children}</h2>,
              h2: ({ children }) => <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>{children}</h3>,
              h3: ({ children }) => <h4 style={{ fontSize: '15px', marginBottom: '6px' }}>{children}</h4>,
              p: ({ children }) => <p style={{ marginBottom: '10px' }}>{children}</p>,
              ul: ({ children }) => <ul style={{ paddingLeft: '20px', marginBottom: '10px' }}>{children}</ul>,
              ol: ({ children }) => <ol style={{ paddingLeft: '20px', marginBottom: '10px' }}>{children}</ol>,
              li: ({ children }) => <li style={{ marginBottom: '4px' }}>{children}</li>,
              strong: ({ children }) => <strong style={{ color: '#1e293b' }}>{children}</strong>,
              code: ({ children }) => (
                <code style={{
                  backgroundColor: '#e2e8f0',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontFamily: 'monospace'
                }}>
                  {children}
                </code>
              ),
            }}
          >
            {answer}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}

export default AIQuery
