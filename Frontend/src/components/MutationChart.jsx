import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { motion } from 'framer-motion'

const COLORS = ['#3b82f6', '#8b5cf6', '#f43f5e', '#10b981', '#f59e0b', '#06b6d4', '#ec4899']

const TYPE_COLORS = {
  snp: '#3b82f6',
  insertion: '#8b5cf6',
  deletion: '#f43f5e',
  substitution: '#10b981',
  unknown: '#64748b',
}

const BarTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(148,163,184,0.25)',
      borderRadius: 10,
      padding: '10px 14px',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      boxShadow: '0 8px 24px rgba(15,23,42,0.1)',
    }}>
      <div style={{ color: 'var(--text-dim)', marginBottom: 4, fontSize: 10 }}>{payload[0].payload.name}</div>
      <div style={{ color: payload[0].fill || '#3b82f6', fontWeight: 600 }}>{payload[0].value.toLocaleString()} variants</div>
    </div>
  )
}

export default function MutationChart({ variants }) {
  const top = variants?.topVariants || []
  const totalVariants = variants?.totalVariants || 0

  const consequenceData = useMemo(() => {
    const counts = { ...(variants?.consequenceDistribution || {}) }
    if (!Object.keys(counts).length) {
      top.forEach(v => {
        const key = (v.consequence || 'unknown').toLowerCase()
        counts[key] = (counts[key] || 0) + 1
      })
    }
    const result = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([name, value]) => ({
        name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value,
      }))

    return result.length ? result : [{ name: 'No data', value: 0 }]
  }, [top, variants])

  const stats = [
    { k: 'SNP', v: variants?.snpCount || 0, c: TYPE_COLORS.snp, icon: '●' },
    { k: 'INSERT', v: variants?.insertionCount || 0, c: TYPE_COLORS.insertion, icon: '＋' },
    { k: 'DELETE', v: variants?.deletionCount || 0, c: TYPE_COLORS.deletion, icon: '−' },
    { k: 'OTHER', v: Math.max((totalVariants || 0) - (variants?.snpCount || 0) - (variants?.insertionCount || 0) - (variants?.deletionCount || 0), 0), c: TYPE_COLORS.substitution, icon: '◆' },
  ]

  return (
    <div className="ga-card ga-card-hover p-6 h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <div className="ga-kicker mb-1">VARIANT OVERVIEW</div>
          <div className="font-display font-semibold text-[15px] text-slate-900">Mutation Landscape</div>
        </div>
        <div className="text-right">
          <div className="font-display font-extrabold text-[28px] text-blue-600 leading-none tracking-tight">{totalVariants.toLocaleString()}</div>
          <div className="font-mono text-[9px] text-slate-400 mt-1 tracking-[0.1em]">TOTAL VARIANTS</div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {stats.map((s, i) => (
          <motion.div
            key={s.k}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 hover:border-slate-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[10px]" style={{ color: s.c }}>{s.icon}</span>
              <span className="font-mono text-[9px] tracking-[0.12em] text-slate-500">{s.k}</span>
            </div>
            <div className="font-display font-extrabold text-[20px] tracking-tight" style={{ color: s.c }}>{Number(s.v).toLocaleString()}</div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div className="font-mono text-[9px] text-slate-400 tracking-[0.1em] mb-3 uppercase">By Consequence Type</div>
      <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-3">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={consequenceData} layout="vertical" margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
            <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" width={150} tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(59,130,246,0.04)' }} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={16}>
              {consequenceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
