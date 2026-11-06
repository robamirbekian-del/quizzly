import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ResultsPage({ history }) {
  const navigate = useNavigate()

  if (history.length === 0) {
    return (
      <div className="page">
        <div className="deco-line" />
        <h2 className="section-title">No results yet</h2>
        <p className="section-sub">Complete a quiz to see your results here.</p>
        <button className="btn btn--primary" onClick={() => navigate('/')}>
          Start Studying
        </button>
      </div>
    )
  }

  const latest = history[0]

  function getScoreClass(pct) {
    if (pct >= 80) return 'score-pill--high'
    if (pct >= 60) return 'score-pill--mid'
    return 'score-pill--low'
  }

  function getEmoji(pct) {
    if (pct >= 80) return '🏆'
    if (pct >= 60) return '👍'
    return '📚'
  }

  return (
    <div className="page page--wide">

      {/* ── Hero ── */}
      <div className="deco-line" />
      <h2 className="section-title">{latest.topic} — Results</h2>
      <p className="section-sub">
        Here's a history of all your quizzes. Every attempt makes you sharper.
      </p>

      {/* ── Latest score stats ── */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 40, flexWrap: 'wrap' }}>
        {[
          { num: `${latest.score}/${latest.total}`, lbl: 'Latest Score' },
          { num: `${latest.pct}%`,                  lbl: 'Accuracy' },
          { num: getEmoji(latest.pct),               lbl: latest.pct >= 80 ? 'Excellent!' : latest.pct >= 60 ? 'Good Work' : 'Keep Studying' },
          { num: history.length,                     lbl: 'Total Tests' },
        ].map(({ num, lbl }) => (
          <div key={lbl} className="card" style={{ flex: 1, minWidth: 120, padding: '20px 22px', boxShadow: '4px 4px 0 var(--ink)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 900, lineHeight: 1, marginBottom: 6 }}>
              {num}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--mid)', fontWeight: 500 }}>
              {lbl}
            </div>
          </div>
        ))}
      </div>

      {/* ── History table ── */}
      <div className="card" style={{ overflow: 'hidden', marginBottom: 32 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
              {['Test Name', 'Date', 'Score', 'Level', ''].map(h => (
                <th key={h} style={{
                  padding: '14px 20px', textAlign: 'left',
                  fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                  textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((entry, i) => (
              <tr key={entry.id} style={{ borderTop: '1.5px solid var(--fog)' }}>
                <td style={{ padding: '14px 20px', fontWeight: 600 }}>{entry.topic}</td>
                <td style={{ padding: '14px 20px', color: 'var(--mid)' }}>{entry.date}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span className={`score-pill ${getScoreClass(entry.pct)}`}>
                    {entry.score}/{entry.total} ({entry.pct}%)
                  </span>
                </td>
                <td style={{ padding: '14px 20px', color: 'var(--mid)', textTransform: 'capitalize' }}>
                  {entry.level}
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <button
                    className="btn btn--ghost"
                    style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                    onClick={() => navigate(`/review/${i}`)}
                  >
                    View →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn btn--primary" onClick={() => navigate('/')}>
        ← New Study Session
      </button>

    </div>
  )
}
