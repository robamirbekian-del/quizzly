import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function QuizPage({
  questions, topic,
  currentQuestion, setCurrentQ,
  score, answers,
  submitAnswer, saveResult,
  config,
}) {
  const navigate = useNavigate()
  const [selected, setSelected]     = useState(new Set())
  const [submitted, setSubmitted]   = useState(false)
  const [isCorrect, setIsCorrect]   = useState(null)

  // Redirect home if someone lands here with no questions
  useEffect(() => {
    if (questions.length === 0) navigate('/')
  }, [])

  // Reset selection state whenever the question changes
  useEffect(() => {
    setSelected(new Set())
    setSubmitted(false)
    setIsCorrect(null)
  }, [currentQuestion])

  if (questions.length === 0) return null

  const q        = questions[currentQuestion]
  const total    = questions.length
  const progress = (currentQuestion / total) * 100
  const keys     = ['A', 'B', 'C', 'D']

  function toggleOption(idx) {
    if (submitted) return
    const isMulti = config.qType === 'multiple' && q.correct.length > 1
    setSelected(prev => {
      const next = new Set(isMulti ? prev : [])
      prev.has(idx) ? next.delete(idx) : next.add(idx)
      return next
    })
  }

  function handleSubmit() {
    const correctSet  = new Set(q.correct)
    const correct     = setsEqual(selected, correctSet)
    setIsCorrect(correct)
    setSubmitted(true)
    submitAnswer([...selected], q.correct, correct)
  }

  function handleNext() {
    if (currentQuestion + 1 < total) {
      setCurrentQ(currentQuestion + 1)
    } else {
      // Quiz finished — save result and go to results page
      const pct   = Math.round((score + (isCorrect ? 1 : 0)) / total * 100)
      const entry = {
        id:        Date.now(),
        topic,
        date:      new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        score:     score + (isCorrect ? 1 : 0),
        total,
        pct,
        level:     config.level,
        questions,
        answers:   [...answers, { selected: [...selected], correct: q.correct, isCorrect }],
        articleText: '',  // populated when you add backend storage
      }
      saveResult(entry)
      navigate('/results')
    }
  }

  function getOptionClass(idx) {
    if (!submitted) return selected.has(idx) ? 'option--selected' : ''
    if (q.correct.includes(idx)) return 'option--correct'
    if (selected.has(idx))       return 'option--incorrect'
    return ''
  }

  return (
    <div className="page">

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--mid)', marginBottom: 4 }}>
            {topic}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700 }}>
            Question {currentQuestion + 1} of {total}
          </div>
        </div>
        <div style={{ background: 'var(--ink)', color: 'var(--cream)', borderRadius: 10, padding: '12px 20px', textAlign: 'center', minWidth: 90 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, display: 'block' }}>
            {score}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.7 }}>
            / {total}
          </span>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div style={{ height: 6, background: 'var(--fog)', borderRadius: 3, marginBottom: 36, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'var(--gold)', borderRadius: 3, transition: 'width 0.4s ease' }} />
      </div>

      {/* ── Question card ── */}
      <div className="card" style={{ padding: 32, marginBottom: 24 }}>
        <div className={`diff-badge diff-badge--${q.difficulty}`}>
          {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.22rem', fontWeight: 700, lineHeight: 1.5, marginBottom: 28 }}>
          {q.question}
        </div>

        {/* ── Options ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {q.options.map((opt, idx) => (
            <div
              key={idx}
              onClick={() => toggleOption(idx)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '14px 18px', borderRadius: 10,
                border: '2px solid',
                borderColor: getBorderColor(getOptionClass(idx)),
                background: getBgColor(getOptionClass(idx)),
                cursor: submitted ? 'default' : 'pointer',
                transition: 'all 0.15s',
                userSelect: 'none',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: '0.82rem', minWidth: 24, paddingTop: 2, opacity: 0.6 }}>
                {keys[idx]}
              </span>
              <span style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
                {opt}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Actions ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {submitted ? (
          <span style={{ fontWeight: 600, fontSize: '0.92rem', color: isCorrect ? 'var(--sage)' : 'var(--rust)' }}>
            {isCorrect ? '✓ Correct!' : '✗ Not quite.'}
          </span>
        ) : <span />}

        {!submitted ? (
          <button
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={selected.size === 0}
          >
            Submit
          </button>
        ) : (
          <button className="btn btn--primary" onClick={handleNext}>
            {currentQuestion + 1 < total ? 'Next →' : 'See Results'}
          </button>
        )}
      </div>

    </div>
  )
}

// ── Helpers ──────────────────────────────────
function setsEqual(a, b) {
  if (a.size !== b.size) return false
  for (let x of a) if (!b.has(x)) return false
  return true
}

function getBorderColor(cls) {
  if (cls === 'option--selected')  return 'var(--ink)'
  if (cls === 'option--correct')   return 'var(--sage)'
  if (cls === 'option--incorrect') return 'var(--rust)'
  return 'var(--fog)'
}

function getBgColor(cls) {
  if (cls === 'option--selected')  return 'var(--ink)'
  if (cls === 'option--correct')   return '#edf6f0'
  if (cls === 'option--incorrect') return '#fdf0ed'
  return 'var(--cream)'
}
