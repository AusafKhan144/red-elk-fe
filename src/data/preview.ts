/**
 * Sample data for the Action Plan and Benchmarks preview screens.
 * These screens have no backend support yet — the data below is illustrative
 * and ported verbatim from the approved design prototype. Both pages display
 * a "Preview · sample data" chip until real endpoints exist.
 */

export const PREVIEW_OVERALL = 71;

export type InitiativeStatus = "quick-win" | "recommended" | "planned";
export type InitiativeLevel = "High" | "Medium" | "Low";

export interface PreviewInitiative {
  id: string;
  title: string;
  dimension: string;
  impact: InitiativeLevel;
  effort: InitiativeLevel;
  weeks: number;
  status: InitiativeStatus;
  owner: string;
  desc: string;
  lift: number;
}

export const ACTION_PLAN_PREVIEW = {
  summary: { initiatives: 6, quickWins: 2, estLift: 14 },
  items: [
    {
      id: "p1",
      title: "Stand up automated model monitoring",
      dimension: "Governance & Risk",
      impact: "High",
      effort: "Medium",
      weeks: 8,
      status: "recommended",
      owner: "Platform / MLOps",
      desc: "Deploy drift, bias and performance alerting across all production models with clear ownership.",
      lift: 9,
    },
    {
      id: "p2",
      title: "Establish a formal AI risk register",
      dimension: "Governance & Risk",
      impact: "High",
      effort: "Low",
      weeks: 4,
      status: "quick-win",
      owner: "Risk & Compliance",
      desc: "Catalogue every deployed model, its owner, data sources, and known risks in one reviewed register.",
      lift: 5,
    },
    {
      id: "p3",
      title: "Run an org-wide AI literacy program",
      dimension: "Talent & Skills",
      impact: "Medium",
      effort: "Medium",
      weeks: 12,
      status: "recommended",
      owner: "People / L&D",
      desc: "Role-based training so business units can identify and scope AI opportunities confidently.",
      lift: 7,
    },
    {
      id: "p4",
      title: "Consolidate the training-data catalogue",
      dimension: "Data & Infrastructure",
      impact: "Medium",
      effort: "High",
      weeks: 16,
      status: "planned",
      owner: "Data Engineering",
      desc: "Single governed catalogue with lineage and quality scoring for all AI training data.",
      lift: 6,
    },
    {
      id: "p5",
      title: "Publish a model deployment checklist",
      dimension: "Governance & Risk",
      impact: "Medium",
      effort: "Low",
      weeks: 3,
      status: "quick-win",
      owner: "MLOps",
      desc: "A required pre-launch checklist covering review, monitoring and rollback for every model.",
      lift: 4,
    },
    {
      id: "p6",
      title: "Formalise the scaling playbook",
      dimension: "Adoption & Culture",
      impact: "Medium",
      effort: "Medium",
      weeks: 10,
      status: "planned",
      owner: "Transformation Office",
      desc: "Codify how successful pilots graduate to production so momentum compounds.",
      lift: 5,
    },
  ] as PreviewInitiative[],
};

export interface BenchDim {
  label: string;
  you: number;
  sector: number;
  top: number;
}

export const BENCHMARKS_PREVIEW = {
  sector: "Financial Services",
  peers: 208,
  percentile: 82,
  dims: [
    { label: "Strategy & Vision", you: 82, sector: 64, top: 86 },
    { label: "Data & Infrastructure", you: 71, sector: 58, top: 81 },
    { label: "Technology & Tooling", you: 79, sector: 62, top: 84 },
    { label: "Talent & Skills", you: 64, sector: 55, top: 78 },
    { label: "Governance & Risk", you: 58, sector: 51, top: 80 },
    { label: "Adoption & Culture", you: 73, sector: 57, top: 79 },
  ] as BenchDim[],
};
