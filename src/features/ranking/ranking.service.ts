import { Candidate, Channel, RankedCandidate, RecommendationResult, Shift } from "@/types/domain";
import { evaluateHardRules } from "./hard-rules";
import { scoreCandidate } from "./soft-score";
import {
  calculateCandidateFillLikelihood,
  calculateScenarioFillProbability,
} from "./fill-probability";
import { buildExplanation } from "./explanation";

function recommendChannel(shift: Shift, candidate: Candidate): Channel | null {
  if (candidate.channelPreferences.length === 0) return null;

  if (
    (shift.priorityLevel === "HIGH" || shift.priorityLevel === "CRITICAL") &&
    candidate.channelPreferences.includes("SMS")
  ) {
    return "SMS";
  }

  if (candidate.channelPreferences.includes("APP")) {
    return "APP";
  }

  return candidate.channelPreferences[0] ?? null;
}

export function rankCandidates(
  shift: Shift,
  candidates: Candidate[],
): RecommendationResult {
  const rankings: RankedCandidate[] = candidates.map((candidate) => {
    const hardRuleResult = evaluateHardRules(shift, candidate);

    if (!hardRuleResult.eligible) {
      return {
        candidate,
        eligible: false,
        failures: hardRuleResult.failures,
        recommendedChannel: null,
        fitScore: {
          acceptanceScore: 0,
          responseSpeedScore: 0,
          seniorityScore: 0,
          attendanceScore: 0,
          fairnessAdjustment: 0,
          overtimePenalty: 0,
          fatiguePenalty: 0,
          finalScore: 0,
        },
        fillLikelihood: 0,
        explanation: hardRuleResult.failures,
      };
    }

    const fitScore = scoreCandidate(shift, candidate);
    const fillLikelihood = calculateCandidateFillLikelihood(candidate, fitScore);

    return {
      candidate,
      eligible: true,
      failures: [],
      recommendedChannel: recommendChannel(shift, candidate),
      fitScore,
      fillLikelihood,
      explanation: buildExplanation(shift, candidate, fitScore),
    };
  });

  const eligibleRankings = rankings
    .filter((ranking) => ranking.eligible)
    .sort((a, b) => b.fitScore.finalScore - a.fitScore.finalScore);

  const ineligibleRankings = rankings.filter((ranking) => !ranking.eligible);

  const orderedRankings = [...eligibleRankings, ...ineligibleRankings];
  const recommendedSequence = eligibleRankings.slice(0, 3);
  const predictedFillProbability =
    calculateScenarioFillProbability(recommendedSequence);

  return {
    shift,
    rankings: orderedRankings,
    recommendedSequence,
    predictedFillProbability,
  };
}