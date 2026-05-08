import React, { useState, useEffect } from 'react'

const STEPS = [
  { label: 'Gene lookup', detail: 'Ensembl REST API → /lookup/symbol' },
  { label: 'Region variants', detail: 'Ensembl → /overlap/region' },
  { label: 'Clinical annotation', detail: 'MyVariant.info → ClinVar' },
  { label: 'Population frequencies', detail: 'Ensembl → /variation/human' },
  { label: 'Research papers', detail: 'NCBI → esearch + esummary' },
  { label: 'Risk interpretation', detail: 'Rule-based analysis engine' },
]

export default function LoadingScreen({ gene }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s < STEPS.length - 1 ? s + 1 : s))
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="anim-in" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '65vh',
      gap: 48,
    }}>
      {/* Gene name */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: 10 }}>
          ANALYZING
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 52, color: 'var(--accent)', letterSpacing: '-0.03em', lineHeight: 1 }}>
          {gene}
        </div>
      </div>

      {/* Pipeline steps */}
      <div style={{ width: '100%', maxWidth: 440 }}>
        {STEPS.map((s, i) => {
          const done = i < step
          const active = i === step
          return (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '10px 0',
              borderBottom: i < STEPS.length - 1 ? '1px solid var(--border)' : 'none',
              opacity: i > step ? 0.3 : 1,
              transition: 'opacity 0.4s ease',
            }}>
              {/* Status dot */}
              <div style={{
                width: 8, height: 8,
                borderRadius: '50%',
                flexShrink: 0,
                background: done ? 'var(--accent)' : active ? 'var(--accent)' : 'var(--border-light)',
                boxShadow: active ? '0 0 8px rgba(37,99,235,0.4)' : 'none',
                transition: 'all 0.3s ease',
                animation: active ? 'pulse 1.5s ease-in-out infinite' : 'none',
              }} />

              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: done || active ? 'var(--text)' : 'var(--text-dim)',
                  fontWeight: active ? 500 : 400,
                }}>
                  {s.label}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                  {s.detail}
                </div>
              </div>

              {/* Checkmark */}
              {done && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6.5" fill="rgba(37,99,235,0.1)" stroke="rgba(37,99,235,0.25)"/>
                  <path d="M4.5 7L6.2 8.8L9.5 5.5" stroke="var(--accent)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }
      `}</style>
    </div>
  )
}