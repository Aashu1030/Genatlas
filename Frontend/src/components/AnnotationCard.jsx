import React from 'react'

function SigPill({ sig }) {
  if (!sig || sig === 'Unknown') return <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>Unknown</span>
  const lower = sig.toLowerCase()
  let color = 'var(--text-dim)', bg = 'var(--border)', border = 'var(--border-light)'
  if (lower.includes('pathogenic') && !lower.includes('benign')) {
    color = '#e05757'; bg = 'rgba(224,87,87,0.1)'; border = 'rgba(224,87,87,0.25)'
  } else if (lower.includes('benign')) {
    color = '#4aad7a'; bg = 'rgba(74,173,122,0.1)'; border = 'rgba(74,173,122,0.25)'
  } else if (lower.includes('uncertain') || lower.includes('vus')) {
    color = '#637390'; bg = 'rgba(99,115,144,0.1)'; border = 'rgba(99,115,144,0.2)'
  } else if (lower.includes('conflicting')) {
    color = '#d4914a'; bg = 'rgba(212,145,74,0.1)'; border = 'rgba(212,145,74,0.2)'
  }
  return (
    <span style={{ padding: '4px 10px', borderRadius: 5, background: bg, border: `1px solid ${border}`, color, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
      {sig}
    </span>
  )
}

function FieldRow({ label, children }) {
  return (
    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 12 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  )
}

export default function AnnotationCard({ annotation }) {
  if (!annotation) return null
  const { variantId, clinicalSignificance, trait, diseaseAssociations, reviewStatus, gene, variantType, caddScore, source } = annotation

  return (
    <div className="card" style={{ padding: '20px', height: '100%' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 16 }}>CLINICAL ANNOTATION</div>

      <FieldRow label="VARIANT">
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)' }}>{variantId || 'N/A'}</span>
      </FieldRow>

      <FieldRow label="CLINICAL SIGNIFICANCE">
        <SigPill sig={clinicalSignificance} />
      </FieldRow>

      <FieldRow label="PRIMARY TRAIT">
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text)' }}>{trait || 'N/A'}</span>
      </FieldRow>

      {diseaseAssociations && diseaseAssociations.length > 0 && (
        <FieldRow label="DISEASE ASSOCIATIONS">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {diseaseAssociations.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)', opacity: 0.5, flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.4 }}>
                  {d.length > 52 ? d.slice(0, 52) + '…' : d}
                </span>
              </div>
            ))}
          </div>
        </FieldRow>
      )}

      <FieldRow label="REVIEW STATUS">
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-dim)' }}>{reviewStatus || 'N/A'}</span>
      </FieldRow>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {caddScore !== null && caddScore !== undefined && (
          <div style={{ padding: '10px', background: 'var(--surface-2)', borderRadius: 7 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 4 }}>CADD SCORE</div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20,
              color: caddScore > 20 ? '#e05757' : caddScore > 10 ? '#d4914a' : '#4aad7a',
            }}>{parseFloat(caddScore).toFixed(1)}</div>
          </div>
        )}
        {variantType && variantType !== 'N/A' && (
          <div style={{ padding: '10px', background: 'var(--surface-2)', borderRadius: 7 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 4 }}>VARIANT TYPE</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text)' }}>{variantType}</div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', opacity: 0.4 }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>{source || 'MyVariant.info / ClinVar'}</span>
      </div>
    </div>
  )
}