import React, { useState, useEffect } from 'react'

const STEPS = [
  { label: 'Gene lookup', detail: 'Ensembl REST API → /lookup/symbol', icon: '🔍' },
  { label: 'Variant overlap', detail: 'Ensembl → /overlap/id?feature=variation', icon: '🧬' },
  { label: 'DNA sequence', detail: 'Ensembl → /sequence/id', icon: '🔗' },
  { label: 'Mutation statistics', detail: 'Variant class aggregation', icon: '📊' },
  { label: 'Research papers', detail: 'NCBI PubMed → esearch + esummary', icon: '📄' },
  { label: 'Disease relevance', detail: 'Keyword signals from metadata', icon: '🏥' },
]

export default function LoadingScreen({ gene }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s < STEPS.length - 1 ? s + 1 : s))
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div className="anim-in" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '65vh',
      gap: 40,
    }}>
      {/* Gene name */}
      <div style={{ textAlign: 'center' }}>
        <div className="ga-kicker" style={{ marginBottom: 12 }}>ANALYZING</div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 56,
          lineHeight: 1,
          letterSpacing: '-0.04em',
        }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
        >
          {gene}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 mb-6">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Pipeline steps */}
        {STEPS.map((s, i) => {
          const done = i < step
          const active = i === step
          return (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '10px 12px',
              borderRadius: 12,
              marginBottom: 2,
              opacity: i > step ? 0.3 : 1,
              background: active ? 'rgba(59,130,246,0.04)' : 'transparent',
              transition: 'all 0.4s ease',
            }}>
              {/* Status icon */}
              {done ? (
                <div className="size-6 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 6L5.2 8.2L9 4" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ) : active ? (
                <div className="size-6 rounded-lg bg-blue-100 border border-blue-300 flex items-center justify-center shrink-0">
                  <div className="size-2 rounded-full bg-blue-500" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
                </div>
              ) : (
                <div className="size-6 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  <div className="size-1.5 rounded-full bg-slate-300" />
                </div>
              )}

              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: done || active ? 'var(--text)' : 'var(--text-dim)',
                  fontWeight: active ? 500 : 400,
                }}>
                  {s.label}
                </div>
                <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                  {s.detail}
                </div>
              </div>

              {/* Duration indicator for completed */}
              {done && (
                <span className="font-mono text-[9px] text-blue-400">done</span>
              )}
              {active && (
                <span className="dot-pulse" style={{ display: 'flex', gap: 3 }}><span/><span/><span/></span>
              )}
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }
      `}</style>
    </div>
  )
}
