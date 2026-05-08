import React, { useMemo } from "react"

const C = {
  A: "#60a5fa",
  T: "#34d399",
  G: "#a78bfa",
  C: "#fb7185",
}

const pct = (x) => (Number.isFinite(+x) ? `${(+x).toFixed(2)}%` : "0%")

export default function SequenceIntelligence({ sequence = {}, gene = {} }) {
  const comp = sequence.baseComposition || {}
  const total = sequence.length || 0
  const snippet = (sequence.snippet || "").slice(0, 120)

  const rows = useMemo(
    () =>
      ["A", "T", "G", "C"].map((b) => {
        const n = comp[b] || 0
        return { b, n, p: total ? (n / total) * 100 : 0 }
      }),
    [comp, total]
  )

  return (
    <section className="ga-card ga-card-hover h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="ga-kicker mb-1">DNA SEQUENCE</div>
          <div className="font-display font-semibold text-[14px] text-slate-900">Composition</div>
        </div>
        <div className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
          {gene.assembly || "GRCh38"}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
          <div className="font-mono text-[9px] tracking-[0.1em] text-slate-500">LENGTH</div>
          <div className="font-display font-bold text-[16px] text-slate-900 mt-1">{total.toLocaleString()}</div>
          <div className="font-mono text-[9px] text-slate-400">bp</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
          <div className="font-mono text-[9px] tracking-[0.1em] text-slate-500">GC CONTENT</div>
          <div className="font-display font-bold text-[16px] mt-1" style={{ color: '#34d399' }}>{pct(sequence.gcContent)}</div>
          <div className="font-mono text-[9px] text-slate-400">ratio</div>
        </div>
      </div>

      {/* Base composition bars */}
      <div className="space-y-2 mb-3 flex-1">
        {rows.map((r) => (
          <div key={r.b}>
            <div className="flex justify-between items-center text-[10px] mb-0.5">
              <span className="font-mono font-semibold" style={{ color: C[r.b] }}>{r.b}</span>
              <span className="font-mono text-slate-500">
                {r.n.toLocaleString()} <span className="text-slate-400">({r.p.toFixed(1)}%)</span>
              </span>
            </div>
            <div className="h-[4px] bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.max(r.p, 0.5)}%`, background: C[r.b] }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Snippet */}
      <div className="border-t border-slate-200 pt-3 mt-auto">
        <div className="font-mono text-[9px] tracking-[0.1em] text-slate-500 mb-1.5">SNIPPET</div>
        <div className="bg-slate-900 text-emerald-400 p-2.5 rounded-lg text-[9.5px] font-mono leading-relaxed break-all max-h-[60px] overflow-hidden">
          {snippet || "—"}
        </div>
      </div>
    </section>
  )
}