import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const API = '/api'

// Animated sparkle icon for the AI badge
function SparkleIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z"
        fill="url(#sparkle-gradient)"
        stroke="url(#sparkle-gradient)"
        strokeWidth="0.5"
      />
      <defs>
        <linearGradient id="sparkle-gradient" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="0.5" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Typing animation for the summary text
function TypeWriter({ text, speed = 12 }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const idx = useRef(0)

  useEffect(() => {
    idx.current = 0
    setDisplayed('')
    setDone(false)
  }, [text])

  useEffect(() => {
    if (!text) return
    if (idx.current >= text.length) {
      setDone(true)
      return
    }
    const timer = setTimeout(() => {
      idx.current += 1
      setDisplayed(text.slice(0, idx.current))
      if (idx.current >= text.length) setDone(true)
    }, speed)
    return () => clearTimeout(timer)
  }, [displayed, text, speed])

  return (
    <span>
      {displayed}
      {!done && <span className="inline-block w-[2px] h-[14px] bg-violet-500 ml-[2px] animate-pulse align-middle" />}
    </span>
  )
}

// Loading skeleton with shimmer
function SummarySkeleton() {
  return (
    <div className="space-y-3 py-2">
      {[100, 92, 85, 70, 95, 60].map((w, i) => (
        <div
          key={i}
          className="h-[14px] rounded-md skeleton"
          style={{ width: `${w}%`, animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  )
}

export default function GeminiSummary({ gene }) {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [collapsed, setCollapsed] = useState(false)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (!gene?.name || hasFetched.current) return
    hasFetched.current = true

    const fetchSummary = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (gene.description) params.set('description', gene.description)
        if (gene.biotype) params.set('biotype', gene.biotype)
        if (gene.chromosome) params.set('chromosome', `Chr ${gene.chromosome}`)
        const res = await axios.get(
          `${API}/gemini-summary/${gene.name}?${params.toString()}`,
          { timeout: 35000 }
        )
        if (res.data?.success && res.data?.summary) {
          setSummary(res.data.summary)
        } else {
          setError('Received an empty summary')
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          'Failed to generate summary'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [gene])

  // Reset when gene changes
  useEffect(() => {
    hasFetched.current = false
    setSummary(null)
    setError(null)
    setCollapsed(false)
  }, [gene?.name])

  const handleRetry = () => {
    hasFetched.current = false
    setSummary(null)
    setError(null)
    setLoading(false)
    // Re-trigger
    setTimeout(() => {
      hasFetched.current = false
      setSummary(null)
      const fetchSummary = async () => {
        setLoading(true)
        setError(null)
        try {
          const params = new URLSearchParams()
          if (gene?.description) params.set('description', gene.description)
          if (gene?.biotype) params.set('biotype', gene.biotype)
          if (gene?.chromosome) params.set('chromosome', `Chr ${gene.chromosome}`)
          const res = await axios.get(
            `${API}/gemini-summary/${gene.name}?${params.toString()}`,
            { timeout: 35000 }
          )
          if (res.data?.success && res.data?.summary) {
            setSummary(res.data.summary)
          } else {
            setError('Received an empty summary')
          }
        } catch (err) {
          setError(err.response?.data?.message || err.message || 'Failed to generate summary')
        } finally {
          setLoading(false)
        }
      }
      fetchSummary()
    }, 100)
  }

  return (
    <div className="ga-card overflow-hidden" style={{
      background: 'linear-gradient(135deg, rgba(139,92,246,0.03) 0%, rgba(99,102,241,0.03) 50%, rgba(168,85,247,0.03) 100%)',
      borderColor: 'rgba(139,92,246,0.15)',
    }}>
      {/* Decorative top gradient bar */}
      <div style={{
        height: 3,
        background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7, #6366f1)',
        backgroundSize: '200% 100%',
        animation: 'gemini-bar 3s linear infinite',
      }} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* AI Icon badge */}
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.1) 100%)',
              border: '1px solid rgba(139,92,246,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <SparkleIcon size={18} />
            </div>
            <div>
              <div className="font-display font-semibold text-[15px] text-slate-900 flex items-center gap-2">
                AI Gene Summary
                <span style={{
                  fontSize: 9,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.08em',
                  padding: '2px 8px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                }}>
                  Gemini
                </span>
              </div>
              <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                Simple explanation for everyone • Powered by Google Gemini
              </div>
            </div>
          </div>

          {/* Collapse toggle */}
          {summary && (
            <button
              onClick={() => setCollapsed(c => !c)}
              className="p-2 rounded-xl hover:bg-violet-50 transition-all text-slate-400 hover:text-violet-600"
              title={collapsed ? 'Expand' : 'Collapse'}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d={collapsed ? "M3 5L7 9L11 5" : "M3 9L7 5L11 9"}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        {!collapsed && (
          <div style={{
            transition: 'all 0.3s ease',
          }}>
            {/* Loading state */}
            {loading && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="dot-pulse text-violet-500">
                    <span /><span /><span />
                  </div>
                  <span className="font-mono text-[11px] text-violet-500">
                    Gemini is thinking about {gene?.name}…
                  </span>
                </div>
                <SummarySkeleton />
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <div style={{
                padding: '16px 20px',
                borderRadius: 14,
                background: 'rgba(239,68,68,0.04)',
                border: '1px solid rgba(239,68,68,0.15)',
              }}>
                <div className="flex items-start gap-3">
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: 'rgba(239,68,68,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="5.5" stroke="#ef4444" strokeWidth="1.2"/>
                      <path d="M7 4.5V7.5M7 9V9.01" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-mono text-[11px] text-red-700 font-medium mb-1">
                      Could not generate summary
                    </div>
                    <div className="font-body text-[11px] text-red-600/70 leading-relaxed">
                      {error}
                    </div>
                  </div>
                  <button
                    onClick={handleRetry}
                    className="shrink-0 px-3 py-1.5 rounded-lg border border-red-200 bg-white font-mono text-[10px] text-red-600 hover:bg-red-50 hover:border-red-300 transition-all"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Summary content */}
            {summary && !loading && (
              <div style={{
                padding: '20px 24px',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(139,92,246,0.1)',
                backdropFilter: 'blur(8px)',
              }}>
                <div className="font-body text-[13px] text-slate-700 leading-[1.85] whitespace-pre-line">
                  <TypeWriter text={summary} speed={8} />
                </div>
              </div>
            )}

            {/* Footer note */}
            {summary && !loading && (
              <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid rgba(139,92,246,0.08)' }}>
                <div className="flex items-center gap-1.5">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <circle cx="5" cy="5" r="4" stroke="#a78bfa" strokeWidth="0.8"/>
                    <path d="M5 3.5V5.5M5 7V7.01" stroke="#a78bfa" strokeWidth="0.8" strokeLinecap="round"/>
                  </svg>
                  <span className="font-mono text-[9px] text-violet-400">
                    AI-generated summary — verify with medical professionals
                  </span>
                </div>
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-violet-50 font-mono text-[10px] text-violet-500 hover:text-violet-700 transition-all"
                >
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M1.5 5.5A4 4 0 019 2.6M9.5 5.5A4 4 0 012 8.4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                    <path d="M9 0.5V3H6.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 10.5V8H4.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Regenerate
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes gemini-bar {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}
