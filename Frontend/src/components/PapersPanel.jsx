import React from 'react'

export default function PapersPanel({ papers }) {
  return (
    <section className="ga-card ga-card-hover p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="ga-kicker mb-1">RESEARCH PAPERS</div>
          <div className="font-display font-semibold text-[15px] text-slate-900">PubMed Literature</div>
        </div>
        <span className="font-mono text-[10px] text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-2.5 py-1">{papers?.length || 0} results</span>
      </div>

      {papers && papers.length > 0 ? (
        <div className="flex-1 flex flex-col">
          {papers.map((p, i) => (
            <a
              key={p.pmid || i}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block py-3.5 border-b border-slate-100 last:border-b-0 hover:bg-blue-50/40 rounded-xl px-3 -mx-3 transition-all"
            >
              <div className="font-body text-[12px] text-slate-800 leading-6 mb-1.5 line-clamp-2 group-hover:text-blue-800 transition-colors">
                {p.title}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {p.pubDate && (
                  <span className="font-mono text-[10px] text-slate-500">{p.pubDate}</span>
                )}
                {p.journal && (
                  <span className="font-mono text-[9px] text-blue-700 px-2 py-0.5 bg-blue-50 border border-blue-200/70 rounded-md">{p.journal}</span>
                )}
                {p.authors && p.authors.length > 0 && (
                  <span className="font-body text-[10px] text-slate-400">
                    {p.authors.slice(0, 2).join(', ')}{p.authors.length > 2 ? ' et al.' : ''}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8">
          <div className="size-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="3" y="2" width="12" height="18" rx="2" stroke="#cbd5e1" strokeWidth="1.2"/>
              <path d="M6 7h6M6 10h6M6 13h4" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-mono text-[11px] text-slate-400">No papers found</span>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="size-1.5 rounded-full bg-green-400"></div>
          <span className="font-mono text-[9px] text-slate-400">Source: NCBI PubMed E-utilities</span>
        </div>
      </div>
    </section>
  )
}
