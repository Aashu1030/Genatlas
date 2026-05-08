import React from 'react'

export default function PapersPanel({ papers }) {
  return (
    <div className="card" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 4 }}>RESEARCH PAPERS</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>PubMed</div>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{papers?.length || 0}</span>
      </div>

      {papers && papers.length > 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
          {papers.map((p, i) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: '12px 0',
                borderBottom: i < papers.length - 1 ? '1px solid var(--border)' : 'none',
                textDecoration: 'none',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: 'var(--text)',
                lineHeight: 1.5,
                marginBottom: 6,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {p.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                {p.pubdate && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>{p.pubdate}</span>
                )}
                {p.source && (
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 9,
                    color: 'var(--accent)',
                    padding: '2px 7px',
                    background: 'rgba(37,99,235,0.06)',
                    border: '1px solid rgba(37,99,235,0.1)',
                    borderRadius: 4,
                  }}>{p.source}</span>
                )}
                {p.authors && p.authors.length > 0 && (
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--text-muted)' }}>
                    {p.authors.slice(0, 2).join(', ')}{p.authors.length > 2 ? ' et al.' : ''}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="4" y="3" width="16" height="22" rx="2" stroke="var(--border-light)" strokeWidth="1.2"/>
            <path d="M8 9h8M8 13h8M8 17h5" stroke="var(--border-light)" strokeWidth="1" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>No papers found</span>
        </div>
      )}

      <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>Source: NCBI PubMed E-utilities</span>
      </div>
    </div>
  )
}