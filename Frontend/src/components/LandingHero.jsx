import React from 'react'

const GENES = [
  { name: 'BRCA1', label: 'Breast & Ovarian Cancer', chr: 'Chr 17' },
  { name: 'TP53',  label: 'Li-Fraumeni / Pan-cancer', chr: 'Chr 17' },
  { name: 'EGFR',  label: 'Non-small Cell Lung Cancer', chr: 'Chr 7' },
  { name: 'APOE',  label: 'Alzheimer\'s Disease Risk', chr: 'Chr 19' },
]

const FEATURES = [
  { icon: '⬡', title: 'Ensembl Integration', desc: 'Live gene metadata, genomic coordinates, and variant regions from GRCh38.' },
  { icon: '⬡', title: 'ClinVar Annotations', desc: 'Clinical significance and disease traits via MyVariant.info.' },
  { icon: '⬡', title: 'Population Genomics', desc: 'Allele frequencies across EUR, AFR, EAS, SAS, and AMR populations.' },
  { icon: '⬡', title: 'Risk Interpretation', desc: 'Rule-based pathogenicity scoring with confidence metrics.' },
]

export default function LandingHero({ onQuick }) {
  return (
    <div style={{ paddingTop: 72, paddingBottom: 48 }}>
      {/* Hero text */}
      <div className="anim-up d-0" style={{ textAlign: 'center', marginBottom: 64 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '5px 14px',
          border: '1px solid rgba(37,99,235,0.2)',
          borderRadius: 99,
          background: 'rgba(37,99,235,0.05)',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--accent)',
          letterSpacing: '0.1em',
          marginBottom: 28,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', opacity: 0.8 }} />
          GENOMIC ARCHITECTURE OF DISEASE
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(36px, 5vw, 64px)',
          fontWeight: 800,
          color: 'var(--text)',
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          marginBottom: 20,
        }}>
          Decode genomic variants.<br />
          <span style={{ color: 'var(--accent)', opacity: 0.8 }}>Understand disease risk.</span>
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 16,
          color: 'var(--text-dim)',
          maxWidth: 520,
          margin: '0 auto',
          lineHeight: 1.7,
          fontWeight: 300,
        }}>
          GeneAtlas aggregates real-time data from Ensembl, ClinVar, and NCBI to deliver structured genomic intelligence — no ML, no black boxes.
        </p>
      </div>

      {/* Quick gene cards */}
      <div className="anim-up d-1" style={{ marginBottom: 64 }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-muted)',
          letterSpacing: '0.12em',
          textAlign: 'center',
          marginBottom: 16,
        }}>SELECT A GENE TO BEGIN</div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
          maxWidth: 900,
          margin: '0 auto',
        }}>
          {GENES.map((g, i) => (
            <button
              key={g.name}
              onClick={() => onQuick(g.name)}
              className="card"
              style={{
                padding: '20px 20px 18px',
                textAlign: 'left',
                cursor: 'pointer',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                borderRadius: 10,
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(37,99,235,0.3)'
                e.currentTarget.style.background = 'var(--surface-2)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.background = 'var(--surface)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 22,
                color: 'var(--accent)',
                letterSpacing: '-0.02em',
                marginBottom: 6,
              }}>{g.name}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-dim)', marginBottom: 10 }}>{g.label}</div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-muted)',
                padding: '3px 8px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                display: 'inline-block',
              }}>{g.chr}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Feature grid */}
      <div className="anim-up d-2" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 1,
        maxWidth: 860,
        margin: '0 auto',
        border: '1px solid var(--border)',
        borderRadius: 10,
        overflow: 'hidden',
        background: 'var(--border)',
      }}>
        {FEATURES.map((f, i) => (
          <div key={i} style={{
            padding: '20px 22px',
            background: 'var(--surface)',
          }}>
            <div style={{ fontSize: 16, marginBottom: 8, opacity: 0.4 }}>{f.icon}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: 'var(--text)', marginBottom: 6 }}>{f.title}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}