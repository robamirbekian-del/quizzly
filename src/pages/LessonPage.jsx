import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LessonPage({ articleText, setArticleText }) {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  function handleGenerate() {
    if (articleText.trim().length < 100) {
      setError('Please paste at least 100 characters of content.')
      return
    }
    setError('')
    navigate('/format')
  }

  return (
    <div className="page">

      {/* ── Hero ── */}
      <p className="eyebrow">✦ Your AI Study Partner</p>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
        fontWeight: 900, lineHeight: 1.1, marginBottom: 16
      }}>
        Paste an article.<br />Get a <span style={{ color: 'var(--gold)' }}>quiz</span>.
      </h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--mid)', maxWidth: 520, lineHeight: 1.65, marginBottom: 48 }}>
        Drop any article, textbook excerpt, or notes below and Quizzly will
        turn it into a personalised study session in seconds.
      </p>

      {/* ── Input card ── */}
      <div className="card" style={{ overflow: 'hidden', marginBottom: 12 }}>

        {/* Textarea */}
        <textarea
          value={articleText}
          onChange={e => {
            setArticleText(e.target.value)
            setError('')
          }}
          placeholder="Paste your article, notes, or textbook excerpt here…"
          style={{
            width: '100%', minHeight: 240,
            padding: '20px 24px',
            fontFamily: 'var(--font-body)', fontSize: '0.97rem', lineHeight: 1.7,
            border: 'none', outline: 'none', resize: 'vertical',
            background: 'white', color: 'var(--ink)',
          }}
        />

        {/* Footer bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px',
          borderTop: '2px solid var(--fog)',
          background: 'var(--cream)',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--mid)' }}>
            {articleText.length} characters
          </span>
          <button className="btn btn--primary" onClick={handleGenerate}>
            Generate Questions →
          </button>
        </div>
      </div>

      {/* ── Error message ── */}
      {error && (
        <p style={{ color: 'var(--rust)', fontSize: '0.88rem', marginTop: 8 }}>
          {error}
        </p>
      )}

    </div>
  )
}
