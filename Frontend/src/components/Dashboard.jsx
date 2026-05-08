import React from 'react'
import GeneOverview from './GeneOverview'
import InterpretationCard from './InterpretationCard'
import MutationChart from './MutationChart'
import PopulationChart from './PopulationChart'
import AnnotationCard from './AnnotationCard'
import PapersPanel from './PapersPanel'
import VariantTable from './VariantTable'

export default function Dashboard({ data }) {
  const { gene, variants, annotation, populations, papers, interpretation, variantDistribution, meta } = data

  return (
    <div style={{ paddingTop: 28 }}>
      {/* Row 1: Gene overview + Interpretation + Annotation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div className="anim-up d-0"><GeneOverview gene={gene} meta={meta} interpretation={interpretation} /></div>
        <div className="anim-up d-1"><InterpretationCard interpretation={interpretation} /></div>
        <div className="anim-up d-2"><AnnotationCard annotation={annotation} /></div>
      </div>

      {/* Row 2: Mutation chart + Population chart + Papers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.9fr', gap: 14, marginBottom: 14 }}>
        <div className="anim-up d-2"><MutationChart variants={variants} variantDistribution={variantDistribution} /></div>
        <div className="anim-up d-3"><PopulationChart populations={populations} populationSource={meta?.populationSource} /></div>
        <div className="anim-up d-4"><PapersPanel papers={papers} /></div>
      </div>

      {/* Row 3: Variant table */}
      <div className="anim-up d-4">
        <VariantTable variants={variants} />
      </div>
    </div>
  )
}