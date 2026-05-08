import React from "react"
import GeneOverview from "./GeneOverview"
import MutationChart from "./MutationChart"
import PapersPanel from "./PapersPanel"
import VariantTable from "./VariantTable"
import SequenceIntelligence from "./SequenceIntelligence"
import DiseaseAssociationsPanel from "./DiseaseAssociationsPanel"
import GeminiSummary from "./GeminiSummary"

export default function Dashboard({ data }) {
  const { gene, sequence, variants, diseaseAssociations, researchPapers } = data

  return (
    <div className="pt-7">
      {/* AI SUMMARY — Gemini-powered layperson explanation */}
      <div className="anim-up d-0 mb-5">
        <GeminiSummary gene={gene} />
      </div>

      {/* TOP ROW — Gene overview + Sequence + Disease */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5 mb-5">
        <div className="anim-up d-1">
          <GeneOverview gene={gene} variants={variants} />
        </div>
        <div className="anim-up d-2 grid grid-cols-2 gap-5 items-stretch">
          <SequenceIntelligence sequence={sequence} gene={gene} />
          <DiseaseAssociationsPanel items={diseaseAssociations} />
        </div>
      </div>

      {/* MIDDLE ROW — Mutation chart + Papers */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr] gap-5 mb-5">
        <div className="anim-up d-3">
          <MutationChart variants={variants} />
        </div>
        <div className="anim-up d-4">
          <PapersPanel papers={researchPapers} />
        </div>
      </div>

      {/* BOTTOM ROW — Variant table (all variants visible with pagination) */}
      <div className="anim-up d-5">
        <VariantTable variants={variants?.topVariants || []} />
      </div>
    </div>
  )
}