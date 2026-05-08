import React from 'react'

export default function ErrorScreen({ message, gene, onRetry, onBack }) {
  return (
    <div className="anim-up d-0" style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', gap: 24, textAlign: 'center',
    }}>
      <div className="size-16 rounded-2xl border border-red-200 bg-red-50 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="11" stroke="#f43f5e" strokeWidth="1.5"/>
          <path d="M14 9v7" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="14" cy="20" r="1.2" fill="#f43f5e"/>
        </svg>
      </div>

      <div>
        <div className="font-display font-bold text-[22px] text-slate-900 mb-2">
          {gene ? `Could not load ${gene}` : 'Request failed'}
        </div>
        <div className="font-body text-[13px] text-slate-500 max-w-[440px] leading-relaxed mx-auto">
          {message}
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        <button
          onClick={onRetry}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-mono text-[12px] font-medium hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-200 cursor-pointer"
        >Retry</button>
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-mono text-[12px] font-medium hover:border-slate-300 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
        >Back to home</button>
      </div>
    </div>
  )
}
