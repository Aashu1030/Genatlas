import React from 'react'

export default function ErrorScreen({ message, gene, onRetry, onBack }) {
  return (
    <div className="anim-up d-0" style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', gap: 20, textAlign: 'center',
    }}>
      <div style={{
        width: 52, height: 52,
        borderRadius: 12,
        border: '1px solid rgba(220,38,38,0.2)',
        background: 'rgba(220,38,38,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="9.5" stroke="#dc2626" strokeWidth="1.2"/>
          <path d="M11 7v5.5M11 15.5v.5" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--text)', marginBottom: 6 }}>
          {gene ? `Could not load ${gene}` : 'Request failed'}
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-dim)', maxWidth: 440, lineHeight: 1.6 }}>
          {message}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button
          onClick={onRetry}
          style={{
            padding: '8px 20px',
            background: 'rgba(37,99,235,0.08)',
            border: '1px solid rgba(37,99,235,0.2)',
            borderRadius: 7,
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--accent)',
            cursor: 'pointer',
          }}
        >Retry</button>
        <button
          onClick={onBack}
          style={{
            padding: '8px 20px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 7,
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--text-dim)',
            cursor: 'pointer',
          }}
        >Back</button>
      </div>
    </div>
  )
}