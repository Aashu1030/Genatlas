import React from 'react'

const GENES = [
  { name: 'BRCA1', label: 'Breast & Ovarian Cancer',      chr: 'Chr 17', color: '#f43f5e' },
  { name: 'TP53',  label: 'Li-Fraumeni / Pan-cancer',     chr: 'Chr 17', color: '#8b5cf6' },
  { name: 'EGFR',  label: 'Non-small Cell Lung Cancer',   chr: 'Chr 7',  color: '#3b82f6' },
  { name: 'APOE',  label: "Alzheimer's Disease Risk",     chr: 'Chr 19', color: '#10b981' },
]

const FEATURES = [
  { icon: '⬡', title: 'Ensembl Integration',   desc: 'Live gene metadata, genomic coordinates, and variant data from GRCh38.' },
  { icon: '◈', title: 'Mutation Intelligence', desc: 'Variant class breakdown with SNP, insertion, and deletion analytics.' },
  { icon: '◎', title: 'Sequence Analytics',    desc: 'GC content, nucleotide composition, and DNA snippet preview.' },
  { icon: '◇', title: 'Literature Discovery',  desc: 'Relevant PubMed papers for rapid biomedical research grounding.' },
]

export default function LandingHero({ onQuick }) {
  return (
    <div style={{ paddingTop: 64, paddingBottom: 48 }}>
      {/* Hero text */}
      <div className="anim-up d-0" style={{ textAlign: 'center', marginBottom: 56 }}>
        <div className="ga-pill" style={{ marginBottom: 24, display: 'inline-flex' }}>
          <span className="inline-block size-1.5 rounded-full bg-blue-600 animate-pulse" />
          GENOMIC ARCHITECTURE OF DISEASE
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(34px, 5vw, 60px)',
          fontWeight: 800,
          color: 'var(--text)',
          lineHeight: 1.08,
          letterSpacing: '-0.035em',
          marginBottom: 20,
        }}>
          Decode genomic variants.<br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Understand disease risk.</span>
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 15,
          color: 'var(--text-dim)',
          maxWidth: 500,
          margin: '0 auto',
          lineHeight: 1.75,
          fontWeight: 400,
        }}>
          GeneAtlas aggregates real-time data from Ensembl and NCBI PubMed to deliver research-grade gene reports — no fake predictions, no population guesswork.
        </p>
      </div>

      {/* Quick gene cards */}
      <div className="anim-up d-1" style={{ marginBottom: 56 }}>
        <div className="ga-kicker" style={{ textAlign: 'center', marginBottom: 16 }}>
          SELECT A GENE TO BEGIN
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, maxWidth: 880, margin: '0 auto' }}>
          {GENES.map(g => (
            <button
              key={g.name}
              onClick={() => onQuick(g.name)}
              className="ga-card group text-left cursor-pointer hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300"
              style={{ padding: '22px 20px 18px', borderRadius: 14 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="size-2 rounded-full" style={{ background: g.color }} />
                <div className="font-display font-bold text-[22px] tracking-[-0.02em] group-hover:text-blue-700 transition-colors" style={{ color: 'var(--text)' }}>
                  {g.name}
                </div>
              </div>
              <div className="font-body text-[12px] text-slate-500 mb-3 leading-snug">{g.label}</div>
              <div className="inline-flex items-center gap-1.5 font-mono text-[9px] text-slate-400 px-2 py-1 bg-slate-50 border border-slate-200 rounded-md">
                <span className="size-1 rounded-full bg-slate-400" />
                {g.chr}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Feature grid */}
      <div className="anim-up d-2" style={{ maxWidth: 860, margin: '0 auto' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl border border-slate-200 overflow-hidden bg-slate-200">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-white p-5 hover:bg-blue-50/30 transition-colors">
              <div className="text-[18px] mb-2 opacity-40" style={{ color: 'var(--accent)' }}>{f.icon}</div>
              <div className="font-display font-semibold text-[13px] text-slate-900 mb-1.5">{f.title}</div>
              <div className="font-body text-[11.5px] text-slate-500 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
