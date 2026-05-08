import React, { useEffect, useRef, useState } from 'react'

const RISK_CONFIG = {
  High:     { color: '#dc2626', bg: 'rgba(220,38,38,0.06)',  border: 'rgba(220,38,38,0.15)'  },
  Moderate: { color: '#d97706', bg: 'rgba(217,119,6,0.06)', border: 'rgba(217,119,6,0.15)' },
  Low:      { color: '#16a34a', bg: 'rgba(22,163,74,0.06)', border: 'rgba(22,163,74,0.15)' },
  Unknown:  { color: '#64748b', bg: 'rgba(100,116,139,0.06)', border: 'rgba(100,116,139,0.15)' },
}

function ConfidenceBar({ confidence }) {
  const [width, setWidth] = useState(0)
  const pct = Math.round((confidence || 0) * 100)

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 200)
    return () => clearTimeout(t)
  }, [pct])

  const color = pct >= 70 ? 'var(--accent)' : pct >= 50 ? '#d97706' : '#64748b'

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>CONFIDENCE</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color, fontWeight: 500 }}>{pct}%</span>
      </div>
      <div className="conf-bar-track">
        <div className="conf-bar-fill" style={{ width: `${width}%`, background: color }} />
      </div>
    </div>
  )
}

function StatBox({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center', padding: '12px 8px', background: 'var(--surface-2)', borderRadius: 8 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: color || 'var(--text)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginTop: 6, letterSpacing: '0.08em' }}>{label}</div>
    </div>
  )
}

export default function InterpretationCard({ interpretation }) {
  if (!interpretation) return null

  const { risk, confidence, summary, populationFlags, pathway, clinicalSignificance } = interpretation
  const cfg = RISK_CONFIG[risk] || RISK_CONFIG.Unknown

  // derive counts from text since backend gives us confidence+summary+flags
  const pct = Math.round((confidence || 0) * 100)

  return (
    <div className="card" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 14 }}>INTERPRETATION</div>

        {/* Risk level banner */}
        <div style={{
          padding: '12px 16px',
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 16,
        }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: cfg.color, flexShrink: 0, boxShadow: `0 0 8px ${cfg.color}` }} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: cfg.color, letterSpacing: '-0.01em' }}>
              {risk} Risk
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>
              {clinicalSignificance}
            </div>
          </div>
        </div>

        {/* Confidence */}
        <ConfidenceBar confidence={confidence} />
      </div>

      {/* Summary */}
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 10 }}>ANALYSIS SUMMARY</div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.75, fontWeight: 300 }}>
          {summary}
        </p>
      </div>

      {/* Pathway */}
      {pathway && (
        <div style={{ padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 7, borderLeft: '2px solid rgba(37,99,235,0.25)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 4 }}>BIOLOGICAL PATHWAY</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>{pathway}</div>
        </div>
      )}

      {/* Population flags */}
      {populationFlags && populationFlags.length > 0 && (
        <div>
          {populationFlags.map((flag, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              padding: '8px 12px',
              background: 'rgba(217,119,6,0.05)',
              border: '1px solid rgba(217,119,6,0.12)',
              borderRadius: 6,
              marginTop: i > 0 ? 6 : 0,
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginTop: 1, flexShrink: 0 }}>
                <path d="M6 1L11 10H1L6 1Z" stroke="#d97706" strokeWidth="1" fill="rgba(217,119,6,0.12)"/>
                <path d="M6 4.5V7M6 8.5V9" stroke="#d97706" strokeWidth="1" strokeLinecap="round"/>
              </svg>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#d97706', lineHeight: 1.5 }}>{flag}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}