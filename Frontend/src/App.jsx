import React, { useState, useCallback } from 'react'
import axios from 'axios'
import Header from './components/Header'
import LandingHero from './components/LandingHero'
import Dashboard from './components/Dashboard'
import LoadingScreen from './components/LoadingScreen'
import ErrorScreen from './components/ErrorScreen'

const API = '/api'

function normalizeReport(r) {
  const gene = r?.gene || {}
  const variants = r?.variants || {}
  const seq = r?.sequence || {}
  const typeDistribution = {
    snp: 0,
    insertion: 0,
    deletion: 0,
    substitution: 0,
    unknown: 0,
    ...(variants.typeDistribution || {}),
  }
  const consequenceDistribution = {
    ...(variants.consequenceDistribution || {}),
  }

  const topVariants = Array.isArray(variants.topVariants) ? variants.topVariants : []

  return {
    gene: {
      name: gene.name || '',
      id: gene.id || '',
      description: gene.description || '',
      chromosome: gene.chromosome || '',
      start: gene.start || 0,
      end: gene.end || 0,
      strand: gene.strand ?? 0,
      biotype: gene.biotype || '',
      assembly: gene.assembly || 'GRCh38',
    },
    sequence: {
      length: seq.length || 0,
      gcContent: seq.gcContent ?? 0,
      baseComposition: seq.baseComposition || { A: 0, T: 0, G: 0, C: 0 },
      snippet: seq.snippet || '',
    },
    variants: {
      totalVariants: variants.totalVariants || Object.values(typeDistribution).reduce((sum, v) => sum + Number(v || 0), 0),
      snpCount: variants.snpCount || typeDistribution.snp || 0,
      insertionCount: variants.insertionCount || typeDistribution.insertion || 0,
      deletionCount: variants.deletionCount || typeDistribution.deletion || 0,
      typeDistribution,
      consequenceDistribution,
      topVariants,
    },
    diseaseAssociations: Array.isArray(r?.diseaseAssociations) ? r.diseaseAssociations : [],
    researchPapers: Array.isArray(r?.researchPapers) ? r.researchPapers : [],
  }
}

export default function App() {
  const [query, setQuery]           = useState('')
  const [data, setData]             = useState(null)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)
  const [activeGene, setActiveGene] = useState(null)

  const search = useCallback(async (geneName) => {
    const name = (geneName || query).trim().toUpperCase()
    if (!name) return
    setLoading(true); setError(null); setData(null)
    setActiveGene(name); setQuery(name)

    try {
      const reportRes = await axios.get(`${API}/report/${name}`, { timeout: 120000 })
      setData(normalizeReport(reportRes.data))
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error   ||
        (err.code === 'ECONNABORTED' ? 'Request timed out — make sure the backend is running on port 3001.' : err.message) ||
        'Unknown error'
      )
    } finally {
      setLoading(false)
    }
  }, [query])

  const handleQuick = (g) => { setQuery(g); search(g) }
  const reset = () => { setData(null); setError(null); setActiveGene(null); setQuery('') }

  return (
    <div className="ga-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header query={query} setQuery={setQuery} onSearch={search} onQuick={handleQuick} onReset={reset} loading={loading} hasData={!!data} />
      <main className="ga-container" style={{ flex: 1, padding: '24px 0 48px' }}>
        {!data && !loading && !error && <LandingHero onQuick={handleQuick} />}
        {loading && <LoadingScreen gene={activeGene} />}
        {error && !loading && <ErrorScreen message={error} gene={activeGene} onRetry={() => search(activeGene)} onBack={reset} />}
        {data && !loading && <Dashboard data={data} />}
      </main>
      <footer className="ga-container" style={{
        borderTop: '1px solid var(--border)',
        padding: '16px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 10,
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.05em',
      }}>
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-green-400"></span>
          GeneAtlas v2.0
        </span>
        <span>Ensembl · NCBI PubMed</span>
        <span>GRCh38 / hg38</span>
      </footer>
    </div>
  )
}
