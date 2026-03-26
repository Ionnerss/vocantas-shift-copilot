import { SCORING_CONFIG } from "@/lib/scoring-config";
import { Candidate, CandidateScoreBreakdown, RankedCandidate } from "@/types/domain";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function calculateCandidateFillLikelihood(
  candidate: Candidate,
  fitScore: CandidateScoreBreakdown,
): number {
  const likelihood =
    fitScore.finalScore * SCORING_CONFIG.fillProbability.scoreWeight +
    candidate.recentAcceptRate * SCORING_CONFIG.fillProbability.acceptRateWeight;

  return Math.round(clamp(likelihood, 0, 100));
}

export function calculateScenarioFillProbability(
  rankedCandidates: RankedCandidate[],
): number {
  const topCandidates = rankedCandidates.slice(0, SCORING_CONFIG.fillProbability.topN);

  if (topCandidates.length === 0) return 0;

  const failureProduct = topCandidates.reduce((product, ranked) => {
    const p = ranked.fillLikelihood / 100;
    return product * (1 - p);
  }, 1);

  return Math.round((1 - failureProduct) * 100);
}