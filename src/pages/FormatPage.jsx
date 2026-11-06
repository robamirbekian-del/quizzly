import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateQuestions } from '../services/api'

export default function FormatPage({
  articleText,
  config, setConfig,
  setQuestions, setTopic,
  resetQuiz,
}) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  // ── Pill selector helper ──
  function Pill({ groupKey, value, label }) {
    const selected = config[groupKey] === value
    return (
      <div
        className={`pill ${selected ? 'pill--selected' : ''}`}
        onClick={() => setConfig(prev => ({ ...prev, [groupKey]: value }))}
      >
        {label}
      </div>
    )
  }

  async function handleStart() {
    setLoading(true)
    setError('')
    resetQuiz()

    try {
      const data = await generateQuestions(articleText, config)
      setTopic(data.topic)
      setQuestions(data.questions)
      navigate('/quiz')
    } catch (e) {
      console.error(e)
      setError('Something went wrong generating your questions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page page--narrow">

      <div className="deco-line" />
      <h2 className="section-title">Set up your test</h2>
      <p className="section-sub">
        Customise the difficulty, length, and format to match your study goals.
      </p>

      {/* ── Level ── */}
      <div style={{ marginBottom: 32 }}>
        <span style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>
          Grade / Level
        </span>
        <div className="pill-group">
          <Pill groupKey="level" value="middle"   label="Middle School" />
          <Pill groupKey="level" value="high"     label="High School" />
          <Pill groupKey="level" value="college"  label="College" />
          <Pill groupKey="level" value="advanced" label="Advanced" />
        </div>
      </div>

      {/* ── Question count ── */}
      <div style={{ marginBottom: 32 }}>
        <span style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>
          Number of Questions
        </span>
        <div className="slider-wrap">
          <input
            type="range" min="3" max="20"
            value={config.qCount}
            onChange={e => setConfig(prev => ({ ...prev, qCount: parseInt(e.target.value) }))}
          />
          <span className="slider-val">{config.qCount}</span>
        </div>
      </div>

      {/* ── Question type ── */}
      <div style={{ marginBottom: 32 }}>
        <span style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>
          Question Type
        </span>
        <div className="pill-group">
          <Pill groupKey="qType" value="multiple" label="Multiple Choice" />
          <Pill groupKey="qType" value="single"   label="True / False" />
        </div>
      </div>

      {/* ── Starting difficulty ── */}
      <div style={{ marginBottom: 40 }}>
        <span style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>
          Starting Difficulty
        </span>
        <div className="pill-group">
          <Pill groupKey="startDiff" value="easy"   label="Easy → Hard" />
          <Pill groupKey="startDiff" value="medium"  label="Medium → Hard" />
          <Pill groupKey="startDiff" value="hard"    label="All Hard" />
          <Pill groupKey="startDiff" value="mixed"   label="Mixed" />
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <p style={{ color: 'var(--rust)', fontSize: '0.88rem', marginBottom: 16 }}>
          {error}
        </p>
      )}

      {/* ── Actions ── */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button className="btn btn--ghost" onClick={() => navigate('/')}>
          ← Back
        </button>
        <button
          className="btn btn--gold btn--lg"
          onClick={handleStart}
          disabled={loading}
        >
          {loading ? 'Generating…' : 'Start Test ✦'}
        </button>
      </div>

      {/* ── Loading state ── */}
      {loading && (
        <p style={{ marginTop: 20, color: 'var(--mid)', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
          🧠 Analysing your article and crafting questions…
        </p>
      )}

    </div>
  )
}
