import React from 'react'

function Row({ label, value, mono = true }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-b-0 group">
      <span className="font-mono text-[10px] tracking-[0.08em] text-slate-500 uppercase">{label}</span>
      <span className={(mono ? 'font-mono' : 'font-body') + " text-[11px] text-slate-800 max-w-[58%] text-right truncate font-medium group-hover:text-blue-700 transition-colors"}>
        {value ?? '—'}
      </span>
    </div>
  )
}

export default function GeneOverview({ gene, variants }) {
  const coordStr = gene.start && gene.end
    ? `${Number(gene.start).toLocaleString()} – ${Number(gene.end).toLocaleString()}`
    : '—'

  const bpLen = gene.start && gene.end
    ? `${((gene.end - gene.start) / 1000).toFixed(1)} kb`
    : '—'

  const proteinCoding = (gene.biotype || '').toLowerCase().includes('protein')
  const totalVariants = variants?.totalVariants ?? null

  return (
    <section className="ga-card ga-card-hover p-6 h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="ga-kicker mb-2">GENE OVERVIEW</div>
          <div className="font-display font-extrabold text-[36px] leading-[1] tracking-[-0.03em] text-slate-900">
            {gene.name}
          </div>
          <div className="font-mono text-[10px] text-slate-400 mt-2 flex items-center gap-2">
            <span className="inline-block size-1.5 rounded-full bg-blue-500 opacity-60" />
            {gene.id}
          </div>
        </div>
        <div className="ga-pill shrink-0">
          <span className="inline-block size-1.5 rounded-full bg-blue-600 animate-pulse" />
          REPORT
        </div>
      </div>

      {/* Data rows */}
      <div className="bg-slate-50/50 rounded-xl border border-slate-100 px-4 py-1 mb-4">
        <Row label="Chromosome" value={gene.chromosome ? `Chr ${gene.chromosome}` : '—'} />
        <Row label="Coordinates" value={coordStr} />
        <Row label="Span" value={bpLen} />
        <Row label="Strand" value={gene.strand === 1 ? '+ (Forward)' : gene.strand === -1 ? '− (Reverse)' : '—'} />
        <Row label="Biotype" value={gene.biotype || '—'} />
        <Row label="Assembly" value={gene.assembly} />
        <Row label="Protein Coding" value={proteinCoding ? 'Yes' : 'No'} />
        {totalVariants !== null && <Row label="Total Variants" value={Number(totalVariants).toLocaleString()} />}
      </div>

      {/* Description */}
      {gene.description && (
        <div className="pt-1">
          <div className="font-mono text-[9px] tracking-[0.1em] text-slate-400 mb-2 uppercase">Description</div>
          <p className="font-body text-[12px] text-slate-600 leading-7">
            {gene.description.length > 280 ? gene.description.slice(0, 280) + '…' : gene.description}
          </p>
        </div>
      )}
    </section>
  )
}
