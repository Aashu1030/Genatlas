import React, { useEffect, useMemo, useState } from 'react'

function normalizeVariant(v = {}) {
  const id = String(v.id || '').trim() || '—'
  const chromosome = String(v.chromosome || '').trim() || '—'
  const position = v.position ?? null
  const alleleChange = String(v.alleleChange || '').trim() || '—'
  const strand = v.strand === 1 ? '+' : v.strand === -1 ? '−' : v.strand === '+' ? '+' : v.strand === '−' ? '−' : '—'
  const consequence = String(v.consequence || '').trim() || '—'

  return { id, chromosome, position, alleleChange, strand, consequence }
}

const SortIcon = ({ dir }) => (
  <span className="ml-1 text-[9px] text-blue-500">{dir === 'asc' ? '↑' : '↓'}</span>
)

export default function VariantTable({ variants }) {
  const [page, setPage] = useState(0)
  const [q, setQ] = useState('')
  const [sortKey, setSortKey] = useState('position')
  const [sortDir, setSortDir] = useState('asc')
  const [perPage, setPerPage] = useState(25)
  const PER_OPTIONS = [10, 25, 50, 100, 250, 500]

  const normalized = useMemo(() => (variants || []).map(normalizeVariant), [variants])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return normalized
    return normalized.filter(v => {
      const hay = `${v.id} ${v.chromosome} ${v.position || ''} ${v.alleleChange} ${v.consequence}`.toLowerCase()
      return hay.includes(term)
    })
  }, [normalized, q])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    const dir = sortDir === 'asc' ? 1 : -1
    arr.sort((a, b) => {
      const av = a?.[sortKey]
      const bv = b?.[sortKey]
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
      return String(av ?? '').localeCompare(String(bv ?? '')) * dir
    })
    return arr
  }, [filtered, sortDir, sortKey])

  const total = sorted.length
  const pages = Math.max(1, Math.ceil(total / perPage))

  useEffect(() => {
    if (page >= pages) setPage(0)
  }, [page, pages])

  const slice = sorted.slice(page * perPage, page * perPage + perPage)

  const cols = [
    { label: 'Variant ID', key: 'id' },
    { label: 'Chr', key: 'chromosome' },
    { label: 'Position', key: 'position' },
    { label: 'Allele', key: 'alleleChange' },
    { label: 'Strand', key: 'strand' },
    { label: 'Consequence', key: 'consequence' },
  ]

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="ga-card ga-card-hover p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between mb-5">
        <div>
          <div className="ga-kicker mb-1">VARIANT TABLE</div>
          <div className="font-display font-semibold text-[15px] text-slate-900 mt-1">Genomic Variants</div>
          <div className="font-mono text-[11px] text-slate-400 mt-1">
            {total.toLocaleString()} entries
            {q && ` matching "${q}"`}
            {normalized.length > 0 && ` · ${normalized.length.toLocaleString()} total loaded`}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Per page selector */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Show</span>
            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(0); }}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-mono text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all cursor-pointer"
            >
              {PER_OPTIONS.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-[280px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <circle cx="5.5" cy="5.5" r="4" stroke="#94a3b8" strokeWidth="1.2"/>
                <path d="M8.5 8.5L11 11" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <input
              value={q}
              onChange={(e) => { setPage(0); setQ(e.target.value) }}
              placeholder="Filter variants…"
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-[12px] font-mono text-slate-800 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/80">
              {cols.map(c => (
                <th
                  key={c.label}
                  onClick={() => handleSort(c.key)}
                  className="text-left py-3.5 px-4 font-mono text-[10px] tracking-[0.14em] text-slate-500 uppercase cursor-pointer hover:text-blue-600 transition-colors select-none whitespace-nowrap"
                >
                  {c.label}
                  {sortKey === c.key && <SortIcon dir={sortDir} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((v, i) => (
              <tr key={i} className="border-b border-slate-100 last:border-b-0 hover:bg-blue-50/30 transition-colors">
                <td className="py-3 px-4 font-mono text-[11px] text-blue-700 font-medium">
                  {v.id.startsWith('rs')
                    ? <a href={`https://www.ncbi.nlm.nih.gov/snp/${v.id}`} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-blue-900 transition-colors">{v.id}</a>
                    : v.id
                  }
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-slate-700">{v.chromosome !== '—' ? `Chr ${v.chromosome}` : '—'}</td>
                <td className="py-3 px-4 font-mono text-[11px] text-slate-700">{v.position !== null ? Number(v.position).toLocaleString() : '—'}</td>
                <td className="py-3 px-4">
                  <span className="inline-flex rounded-lg bg-slate-100 border border-slate-200/80 px-2.5 py-1 text-[10px] font-mono font-semibold text-slate-800">{v.alleleChange}</span>
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-slate-600">{v.strand}</td>
                <td className="py-3 px-4 font-mono text-[10px] text-slate-600 max-w-[200px] truncate">{v.consequence}</td>
              </tr>
            ))}

            {total === 0 && (
              <tr>
                <td colSpan={cols.length} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="size-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <rect x="2" y="2" width="14" height="14" rx="3" stroke="#cbd5e1" strokeWidth="1.2"/>
                        <path d="M6 6l6 6M12 6l-6 6" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">No variants available</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-5 pt-5 border-t border-slate-100">
          <span className="font-mono text-[10px] text-slate-400">
            Showing {page * perPage + 1}–{Math.min((page + 1) * perPage, total)} of {total.toLocaleString()}
          </span>
          <div className="flex items-center gap-2">
            {/* First page */}
            <button
              onClick={() => setPage(0)}
              disabled={page <= 0}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-[11px] text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all"
              title="First page"
            >
              ⟨⟨
            </button>
            <button
              onClick={() => setPage(p => Math.max(p - 1, 0))}
              disabled={page <= 0}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white font-mono text-[11px] text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all"
            >
              ← Prev
            </button>
            <div className="flex items-center gap-1.5 px-2 font-mono text-[10px] text-slate-500">
              <input
                type="number"
                min={1}
                max={pages}
                value={page + 1}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10)
                  if (!isNaN(val) && val >= 1 && val <= pages) setPage(val - 1)
                }}
                className="w-[52px] rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-center text-[11px] font-mono text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
              />
              <span>/ {pages.toLocaleString()}</span>
            </div>
            <button
              onClick={() => setPage(p => Math.min(p + 1, pages - 1))}
              disabled={page >= pages - 1}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white font-mono text-[11px] text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all"
            >
              Next →
            </button>
            {/* Last page */}
            <button
              onClick={() => setPage(pages - 1)}
              disabled={page >= pages - 1}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-[11px] text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all"
              title="Last page"
            >
              ⟩⟩
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
