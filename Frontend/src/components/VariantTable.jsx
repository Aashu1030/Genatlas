import React, { useState } from 'react'

const SIG_COLOR = (sig) => {
  if (!sig) return 'var(--text-muted)'
  const l = sig.toLowerCase()
  if (l.includes('pathogenic') && !l.includes('benign')) return '#dc2626'
  if (l.includes('benign')) return '#16a34a'
  if (l.includes('uncertain')) return '#64748b'
  return 'var(--text-dim)'
}

export default function VariantTable({ variants }) {
  const [page, setPage] = useState(0)
  const PER = 10
  const total = variants?.length || 0
  const pages = Math.ceil(total / PER)
  const slice = (variants || []).slice(page * PER, page * PER + PER)

  const cols = [
    { label: 'Variant ID',  key: 'id',          mono: true,  accent: true },
    { label: 'Position',    key: 'position',     mono: true  },
    { label: 'Alleles',     key: '_alleles',     mono: true  },
    { label: 'Consequence', key: 'consequence',  mono: false },
  ]

  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 4 }}>VARIANT TABLE</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>Genomic Variants</div>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{total} variants</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {cols.map(c => (
                <th key={c.label} style={{
                  textAlign: 'left',
                  paddingBottom: 10,
                  paddingRight: 24,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((v, i) => (
              <tr key={i} className="variant-row">
                <td style={{ padding: '10px 24px 10px 0', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)' }}>
                  {v.id && v.id.startsWith('rs')
                    ? <a href={`https://www.ncbi.nlm.nih.gov/snp/${v.id}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }} onMouseEnter={e => e.target.style.textDecoration = 'underline'} onMouseLeave={e => e.target.style.textDecoration = 'none'}>{v.id}</a>
                    : (v.id || 'N/A')
                  }
                </td>
                <td style={{ padding: '10px 24px 10px 0', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>
                  {v.position?.toLocaleString?.() ?? v.position ?? 'N/A'}
                </td>
                <td style={{ padding: '10px 24px 10px 0', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text)' }}>
                  {v.alleles?.length >= 2
                    ? <><span style={{ color: 'var(--text-dim)' }}>{v.alleles[0]}</span><span style={{ color: 'var(--text-muted)', margin: '0 4px' }}>→</span><span style={{ color: 'var(--text)' }}>{v.alleles.slice(1).join('/')}</span></>
                    : (v.alleles?.join(', ') || '—')
                  }
                </td>
                <td style={{ padding: '10px 0', fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-dim)' }}>
                  {v.consequence ? v.consequence.replace(/_/g, ' ') : '—'}
                </td>
              </tr>
            ))}

            {total === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                  No variants available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
            Page {page + 1} / {pages}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            {[['Prev', page > 0, () => setPage(p => p - 1)], ['Next', page < pages - 1, () => setPage(p => p + 1)]].map(([label, enabled, action]) => (
              <button
                key={label}
                onClick={action}
                disabled={!enabled}
                style={{
                  padding: '5px 14px',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: enabled ? 'var(--text-dim)' : 'var(--text-muted)',
                  cursor: enabled ? 'pointer' : 'not-allowed',
                  opacity: enabled ? 1 : 0.4,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (enabled) { e.target.style.borderColor = 'rgba(37,99,235,0.25)'; e.target.style.color = 'var(--accent)' } }}
                onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = enabled ? 'var(--text-dim)' : 'var(--text-muted)' }}
              >{label}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}