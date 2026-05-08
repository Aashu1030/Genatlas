import React, { useState, useCallback } from 'react'
import axios from 'axios'
import Header from './components/Header'
import LandingHero from './components/LandingHero'
import Dashboard from './components/Dashboard'
import LoadingScreen from './components/LoadingScreen'
import ErrorScreen from "./components/ErrorScreen.jsx";
import AnnotationCard from './components/AnnotationCard'
import  GeneOverview  from './components/GeneOverview'
import  InterpretationCard  from './components/InterpretationCard'
import  MutationChart  from './components/MutationChart'
import  PapersPanel  from './components/PapersPanel'
import  PopulationChart  from './components/PopulationChart'
import  VariantTable  from './components/VariantTable'



export default function App() {
  const [query, setQuery]         = useState('')
  const [data, setData]           = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [activeGene, setActiveGene] = useState(null)

  const search = useCallback(async (geneName) => {
    const name = (geneName || query).trim().toUpperCase()
    if (!name) return

    setLoading(true)
    setError(null)
    setData(null)
    setActiveGene(name)
    setQuery(name)

    try {
      const res = await axios.get(`/api/gene/${name}`, { timeout: 25000 })
      setData(res.data)
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        (err.code === 'ECONNABORTED' ? 'Request timed out — the external APIs may be slow.' : err.message) ||
        'Unknown error'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [query])

  const handleQuick = (gene) => {
    setQuery(gene)
    search(gene)
  }

  const reset = () => {
    setData(null)
    setError(null)
    setActiveGene(null)
    setQuery('')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        query={query}
        setQuery={setQuery}
        onSearch={search}
        onQuick={handleQuick}
        onReset={reset}
        loading={loading}
        hasData={!!data}
      />

      <main style={{ flex: 1, padding: '0 24px 48px', maxWidth: 1520, margin: '0 auto', width: '100%' }}>
        {!data && !loading && !error && (
          <LandingHero onQuick={handleQuick} />
        )}
        {loading && <LoadingScreen gene={activeGene} />}
        {error && !loading && (
          <ErrorScreen message={error} gene={activeGene} onRetry={() => search(activeGene)} onBack={reset} />
        )}
        {data && !loading && (
          <Dashboard data={data} />
        )}
      </main>

      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '14px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 11,
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)',
      }}>
        <span>GeneAtlas v2.0</span>
        <span>Ensembl · MyVariant.info · ClinVar · NCBI PubMed</span>
        <span>GRCh38 / hg38</span>
      </footer>
    </div>
  )
}