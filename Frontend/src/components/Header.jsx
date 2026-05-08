import React from 'react'

const QUICK = ['BRCA1', 'TP53', 'EGFR', 'APOE']

const DNAIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M5 2.5C5 2.5 7 5 9 5C11 5 13 2.5 13 2.5" stroke="#2563eb" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M5 15.5C5 15.5 7 13 9 13C11 13 13 15.5 13 15.5" stroke="#2563eb" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M5 2.5V15.5M13 2.5V15.5" stroke="#2563eb" strokeWidth="1" strokeOpacity="0.35"/>
    <line x1="5" y1="7" x2="13" y2="7" stroke="#2563eb" strokeWidth="1.1" strokeOpacity="0.6"/>
    <line x1="5" y1="9" x2="13" y2="9" stroke="#2563eb" strokeWidth="1.1" strokeOpacity="0.9"/>
    <line x1="5" y1="11" x2="13" y2="11" stroke="#2563eb" strokeWidth="1.1" strokeOpacity="0.6"/>
  </svg>
)

const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <circle cx="5.5" cy="5.5" r="4.2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M8.5 8.5L11.5 11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

export default function Header({ query, setQuery, onSearch, onQuick, onReset, loading, hasData }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      borderBottom: '1px solid var(--border)',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    }}>
      <div style={{
        maxWidth: 1520, margin: '0 auto',
        padding: '0 24px',
        height: 60,
        display: 'flex', alignItems: 'center', gap: 32,
      }}>
        {/* Logo */}
        <button
          onClick={onReset}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 0, flexShrink: 0,
          }}
        >
          <div style={{
            width: 32, height: 32,
            border: '1px solid rgba(37,99,235,0.2)',
            borderRadius: 8,
            background: 'rgba(37,99,235,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <DNAIcon />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>
              GeneAtlas
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em', marginTop: 2 }}>
              GENOMIC INTELLIGENCE
            </div>
          </div>
        </button>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 440, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
            <SearchIcon />
          </div>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSearch()}
            placeholder="Gene symbol — BRCA1, TP53, EGFR…"
            style={{
              width: '100%',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '8px 90px 8px 34px',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--text)',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(37,99,235,0.4)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <button
            onClick={() => onSearch()}
            disabled={loading || !query.trim()}
            style={{
              position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
              padding: '4px 12px',
              background: loading ? 'rgba(37,99,235,0.08)' : 'rgba(37,99,235,0.1)',
              border: '1px solid rgba(37,99,235,0.2)',
              borderRadius: 5,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--accent)',
              cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
              opacity: !query.trim() ? 0.5 : 1,
              transition: 'background 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? (
              <span className="dot-pulse" style={{ display: 'flex', gap: 3 }}>
                <span/><span/><span/>
              </span>
            ) : 'Analyze'}
          </button>
        </div>

        {/* Quick genes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginRight: 4 }}>QUICK</span>
          {QUICK.map(g => (
            <button
              key={g}
              onClick={() => onQuick(g)}
              disabled={loading}
              style={{
                padding: '4px 10px',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 5,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--text-dim)',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.target.style.borderColor = 'rgba(37,99,235,0.35)'; e.target.style.color = 'var(--accent)' }}
              onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-dim)' }}
            >{g}</button>
          ))}
        </div>
      </div>
    </header>
  )
}