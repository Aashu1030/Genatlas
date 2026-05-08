import React from 'react'

const QUICK = ['BRCA1', 'TP53', 'EGFR', 'APOE']

const DNAIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M5 2.5C5 2.5 7.5 5.5 10 5.5C12.5 5.5 15 2.5 15 2.5" stroke="#3b82f6" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M5 17.5C5 17.5 7.5 14.5 10 14.5C12.5 14.5 15 17.5 15 17.5" stroke="#3b82f6" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M5 2.5V17.5M15 2.5V17.5" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.25"/>
    <line x1="5" y1="7.5" x2="15" y2="7.5" stroke="#3b82f6" strokeWidth="1.1" strokeOpacity="0.4"/>
    <line x1="5" y1="10" x2="15" y2="10" stroke="#3b82f6" strokeWidth="1.1" strokeOpacity="0.7"/>
    <line x1="5" y1="12.5" x2="15" y2="12.5" stroke="#3b82f6" strokeWidth="1.1" strokeOpacity="0.4"/>
  </svg>
)

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

export default function Header({ query, setQuery, onSearch, onQuick, onReset, loading }) {
  return (
    <header className="sticky top-0 z-[100] border-b border-slate-200/80 bg-white/75 backdrop-blur-xl backdrop-saturate-150">
      <div className="ga-container h-[60px] flex items-center gap-5">
        {/* Logo */}
        <button onClick={onReset} className="flex items-center gap-2.5 bg-transparent border-0 p-0 cursor-pointer shrink-0 group">
          <div className="size-9 rounded-xl border border-blue-200/80 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center group-hover:border-blue-300 group-hover:shadow-md group-hover:shadow-blue-100 transition-all duration-300">
            <DNAIcon />
          </div>
          <div>
            <div className="font-display font-bold text-[14px] text-slate-900 leading-none tracking-[-0.02em] group-hover:text-blue-700 transition-colors">GeneAtlas</div>
            <div className="font-mono text-[8px] text-slate-400 tracking-[0.14em] mt-0.5">GENOMIC INTELLIGENCE</div>
          </div>
        </button>

        {/* Search */}
        <div className="flex-1 max-w-[480px] relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <SearchIcon />
          </div>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSearch()}
            placeholder="Search gene symbol — BRCA1, TP53, EGFR…"
            className="w-full rounded-xl border border-slate-200 bg-white/90 pl-10 pr-24 py-2.5 font-mono text-[12px] text-slate-800 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-blue-100/80 focus:border-blue-300 transition-all"
          />
          <button
            onClick={() => onSearch()}
            disabled={loading || !query.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-blue-600 px-4 py-1.5 font-mono text-[11px] text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-200"
          >
            {loading ? (
              <span className="dot-pulse" style={{ display: 'flex', gap: 3 }}><span/><span/><span/></span>
            ) : 'Analyze'}
          </button>
        </div>

        {/* Quick genes */}
        <div className="hidden lg:flex items-center gap-1.5 shrink-0">
          <span className="font-mono text-[9px] text-slate-400 mr-1 tracking-[0.1em]">QUICK</span>
          {QUICK.map(g => (
            <button
              key={g}
              onClick={() => onQuick(g)}
              disabled={loading}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-[10px] text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all"
            >{g}</button>
          ))}
        </div>
      </div>
    </header>
  )
}
