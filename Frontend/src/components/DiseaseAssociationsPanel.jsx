import React from 'react'
import { motion } from 'framer-motion'

export default function DiseaseAssociationsPanel({ items }) {
  const list = Array.isArray(items) ? items : []

  return (
    <section className="ga-card ga-card-hover p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="ga-kicker mb-1">DISEASE</div>
          <div className="font-display font-semibold text-[13px] text-slate-900">Associations</div>
        </div>
        <span className="font-mono text-[10px] text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5">{list.length}</span>
      </div>

      {list.length > 0 ? (
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[320px] pr-1">
          {list.slice(0, 8).map((it, i) => (
            <motion.div
              key={`${it.tag}-${i}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.3 }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="font-display font-semibold text-[11px] text-slate-900 leading-tight">{it.tag}</div>
                <span className="font-mono text-[8px] text-blue-600 px-1.5 py-0.5 bg-blue-50 border border-blue-200/60 rounded-md whitespace-nowrap shrink-0">
                  SIGNAL
                </span>
              </div>
              {it.evidence && (
                <div className="mt-1.5 font-mono text-[9px] text-slate-500 leading-5">{it.evidence}</div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-6">
          <div className="size-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="6" stroke="#cbd5e1" strokeWidth="1.2"/>
              <path d="M6 9h6" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-mono text-[10px] text-slate-400 text-center">No strong signals</span>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-slate-100">
        <span className="font-mono text-[8px] text-slate-400">Conservative keyword signals only. Not diagnostic.</span>
      </div>
    </section>
  )
}
