import React from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Cell } from 'recharts'

const POP_COLORS = {
  'Europe':     '#2563eb',
  'Africa':     '#16a34a',
  'East Asia':  '#d97706',
  'South Asia': '#7c3aed',
  'Americas':   '#e05777',
}

// Placeholder data so the chart always renders even with no API data
const PLACEHOLDER_POPS = [
  { population: 'Europe',     percentage: 0, allele: 'N/A', synthetic: true },
  { population: 'Africa',     percentage: 0, allele: 'N/A', synthetic: true },
  { population: 'East Asia',  percentage: 0, allele: 'N/A', synthetic: true },
  { population: 'South Asia', percentage: 0, allele: 'N/A', synthetic: true },
  { population: 'Americas',   percentage: 0, allele: 'N/A', synthetic: true },
]

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  if (d.synthetic) return null
  return (
    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-light)', borderRadius: 7, padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
      <div style={{ color: 'var(--text-dim)', marginBottom: 3 }}>{d.population}</div>
      <div style={{ color: 'var(--accent)', fontWeight: 500 }}>{d.percentage}% allele freq</div>
      {d.allele && d.allele !== 'N/A' && <div style={{ color: 'var(--text-muted)', fontSize: 10, marginTop: 2 }}>allele: {d.allele}</div>}
    </div>
  )
}

export default function PopulationChart({ populations, populationSource }) {
  const hasPops = populations && populations.length > 0
  const displayData = hasPops ? populations : PLACEHOLDER_POPS
  const sourceLabel = populationSource || (hasPops && populations[0]?.source) || null
  const hasRealFreqs = displayData.some(p => p.percentage > 0)

  return (
    <div className="card" style={{ padding: '20px', height: '100%' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 4 }}>POPULATION GENOMICS</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>Allele Frequencies</div>
        {!hasPops ? (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', background: 'var(--surface-2)', padding: '2px 7px', borderRadius: 4, border: '1px solid var(--border)' }}>
            NO DATA
          </span>
        ) : sourceLabel ? (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', background: 'rgba(37,99,235,0.06)', padding: '2px 7px', borderRadius: 4, border: '1px solid rgba(37,99,235,0.15)' }}>
            {sourceLabel}
          </span>
        ) : null}
      </div>

      {/* Radar chart — always show */}
      <ResponsiveContainer width="100%" height={190}>
        <RadarChart data={displayData} margin={{ top: 0, right: 10, bottom: 0, left: 10 }}>
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis
            dataKey="population"
            tick={{ fill: hasPops ? 'var(--text-dim)' : 'var(--text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
          />
          <Radar
            dataKey="percentage"
            stroke={hasPops ? '#2563eb' : 'var(--border-light)'}
            fill={hasPops ? '#2563eb' : 'var(--border-light)'}
            fillOpacity={hasPops ? 0.18 : 0.05}
            strokeWidth={hasPops ? 1.5 : 1}
          />
          {hasPops && <Tooltip content={<CustomTooltip />} />}
        </RadarChart>
      </ResponsiveContainer>

      {/* Bar list */}
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {displayData.map((p, i) => {
          const color = POP_COLORS[p.population] || 'var(--accent)'
          const pctDisplay = p.percentage || 0
          return (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: hasPops ? 'var(--text-dim)' : 'var(--text-muted)' }}>{p.population}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: hasPops ? color : 'var(--text-muted)', fontWeight: hasPops ? 500 : 400 }}>
                  {hasPops ? `${pctDisplay}%` : '—'}
                </span>
              </div>
              <div style={{ height: 2, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${hasPops ? Math.min(pctDisplay * 5, 100) : 0}%`,
                  background: color,
                  borderRadius: 99,
                  transition: 'width 0.8s ease',
                }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary stats */}
      {hasPops && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 14 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--text)' }}>{populations.length}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>POPULATIONS</div>
          </div>
          {populations[0] && (
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: POP_COLORS[populations[0].population] || 'var(--accent)' }}>
                {populations[0].percentage}%
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>HIGHEST ({populations[0].population.toUpperCase()})</div>
            </div>
          )}
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--text)' }}>
              {populations[0]?.allele || 'N/A'}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>TOP ALLELE</div>
          </div>
        </div>
      )}

      {!hasPops && (
        <div style={{ marginTop: 12, padding: '8px 10px', background: 'var(--surface-2)', borderRadius: 6, border: '1px solid var(--border)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
            No population frequency data returned for this variant. Try a gene with a common SNP (e.g. BRCA1, APOE, TP53).
          </span>
        </div>
      )}
    </div>
  )
}