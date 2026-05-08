import React from 'react'

const riskStyle = (risk) => ({
  High:     { cls: 'risk-high',     dot: '#dc2626' },
  Moderate: { cls: 'risk-moderate', dot: '#d97706' },
  Low:      { cls: 'risk-low',      dot: '#16a34a' },
  Unknown:  { cls: 'risk-unknown',  dot: '#64748b' },
}[risk] || { cls: 'risk-unknown', dot: '#64748b' })

function Row({ label, value, mono = true }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
        fontSize: 11,
        color: 'var(--text)',
        maxWidth: '58%',
        textAlign: 'right',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>{value ?? 'N/A'}</span>
    </div>
  )
}

export default function GeneOverview({ gene, meta, interpretation }) {
  const risk = interpretation?.risk || 'Unknown'
  const rs = riskStyle(risk)

  const coordStr = gene.start && gene.end
    ? `${Number(gene.start).toLocaleString()} – ${Number(gene.end).toLocaleString()}`
    : 'N/A'

  const bpLen = gene.start && gene.end
    ? `${((gene.end - gene.start) / 1000).toFixed(1)} kb`
    : 'N/A'

  return (
    <div className="card" style={{ padding: '20px 20px 16px', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 6 }}>GENE OVERVIEW</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1 }}>
            {gene.name}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginTop: 5 }}>{gene.ensemblId}</div>
        </div>
        <div className={rs.cls} style={{ padding: '5px 10px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', flexShrink: 0 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: rs.dot, display: 'inline-block' }} />
          {risk.toUpperCase()} RISK
        </div>
      </div>

      {/* Rows */}
      <div>
        <Row label="CHROMOSOME" value={`Chr ${gene.chromosome}`} />
        <Row label="COORDINATES" value={coordStr} />
        <Row label="SPAN" value={bpLen} />
        <Row label="STRAND" value={gene.strand} />
        <Row label="BIOTYPE" value={gene.biotype} />
        <Row label="ASSEMBLY" value={gene.assembly} />
        <Row label="VARIANTS FETCHED" value={meta?.variantsFetched} />
      </div>

      {/* Description */}
      {gene.description && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.7 }}>
            {gene.description.length > 180 ? gene.description.slice(0, 180) + '…' : gene.description}
          </p>
        </div>
      )}
    </div>
  )
}