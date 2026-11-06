import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { generateQuestions } from '../services/api'

export default function ReviewPage({
  history, saveResult,
  setQuestions, setTopic,
  resetQuiz, config,
}) {
  const navigate    = useNavigate()
  const { id }      = useParams()
  const [loading, setLoading] = React.useState(false)
  const [error, setError]     = React.useState('')

  const entry = history[parseInt(id)]

  if (!entry) {
    return (
      <div className="page">
        <div className="deco-line" />
        <h2 className="section-title">Result not found</h2>
        <p className="section-sub">This result may have been cleared.</p>
        <button className="btn btn--primary" onClick={() => navigate('/results')}>
          Back to Results
        </button>
      </div>
    )
  }

  async function handleRetake() {
    setLoading(true)
    setError('')
    resetQuiz()

    try {
      // Add a small variation so Claude generates fresh questions
      const tweaked = (entry.articleText || entry.topic) + ' [retake-' + Date.now() + ']'
      const data    = await generateQuestions(tweaked, config)
      setTopic(data.topic)
      setQuestions(data.questions)
      navigate('/quiz')
    } catch (e) {
      console.error(e)
      setError('Could not generate new questions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page page--narrow">

      <div className="deco-line" />
      <h2 className="section-title">{entry.topic} — Review</h2>
      <p className="section-sub">
        You scored {entry.score} out of {entry.total} ({entry.pct}%)
      </p>

      {/* ── Question review list ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
        {entry.questions.map((q, i) => {
          const ans     = entry.answers[i]
          const correct = ans?.isCorrect

          const yourText    = ans?.selected.map(idx => q.options[idx]).join(', ') || '—'
          const correctText = q.correct.map(idx => q.options[idx]).join(', ')

          return (
            <div
              key={i}
              style={{
                display: 'flex', gap: 16, alignItems: 'flex-start',
                padding: '20px 22px', borderRadius: 12,
                border: '2px solid',
                borderColor: correct ? '#a8d5b5' : '#f0b8ae',
                background: correct ? '#f3faf6' : '#fdf5f3',
              }}
            >
              <div style={{ fontSize: '1.3rem', marginTop: 2 }}>
                {correct ? '✅' : '❌'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>
                  {i + 1}. {q.question}
                </div>
                {!correct && (
                  <div style={{ fontSize: '0.88rem', marginBottom: 4, color: 'var(--mid)' }}>
                    Your answer: <span style={{ color: 'var(--rust)', fontWeight: 600 }}>{yourText}</span>
                  </div>
                )}
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: correct ? 'var(--sage)' : 'var(--rust)' }}>
                  {correct ? '✓ Correct: ' : 'Correct answer: '}
                  <span>{correctText}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Error ── */}
      {error && (
        <p style={{ color: 'var(--rust)', fontSize: '0.88rem', marginBottom: 16 }}>
          {error}
        </p>
      )}

      {/* ── Actions ── */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="btn btn--ghost" onClick={() => navigate('/results')}>
          ← All Results
        </button>
        <button
          className="btn btn--gold"
          onClick={handleRetake}
          disabled={loading}
        >
          {loading ? 'Generating…' : 'Retake (New Questions) ↺'}
        </button>
        <button className="btn btn--primary" onClick={() => navigate('/')}>
          New Topic
        </button>
      </div>

    </div>
  )
}
