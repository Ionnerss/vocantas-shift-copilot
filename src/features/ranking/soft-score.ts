import { SCORING_CONFIG } from "@/lib/scoring-config";
import { Candidate, CandidateScoreBreakdown, Shift } from "@/types/domain";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getShiftHours(shift: Shift): number {
  const diffMs = shift.endTime.getTime() - shift.startTime.getTime();
  return diffMs / (1000 * 60 * 60);
}

function responseMinutesToScore(minutes: number): number {
  return clamp(100 - Math.max(0, minutes - 5) * 3.5, 0, 100);
}

function getFairnessAdjustment(recentOutreachCount: number): number {
  const value =
    SCORING_CONFIG.fairness.outreachBoostBase -
    recentOutreachCount * SCORING_CONFIG.fairness.outreachDecayPerRecentTouch;

  return clamp(value, 0, 16);
}

function getOvertimePenalty(candidate: Candidate, shift: Shift): number {
  const projectedHours = candidate.weeklyHours + getShiftHours(shift);
  const overtimeHours = Math.max(0, projectedHours - SCORING_CONFIG.maxWeeklyHours);
  return overtimeHours * SCORING_CONFIG.penalties.overtimePerHour;
}

function getFatiguePenalty(candidate: Candidate): number {
  return candidate.fatigueRisk * 100 * (SCORING_CONFIG.penalties.fatigueMultiplier / 100);
}

export function scoreCandidate(
  shift: Shift,
  candidate: Candidate,
): CandidateScoreBreakdown {
  const acceptanceScore = clamp(candidate.recentAcceptRate, 0, 100);
  const responseSpeedScore = responseMinutesToScore(candidate.recentResponseMinutes);
  const seniorityScore = clamp(candidate.seniorityScore, 0, 100);
  const attendanceScore = clamp(candidate.attendanceScore, 0, 100);
  const fairnessAdjustment = getFairnessAdjustment(candidate.recentOutreachCount);
  const overtimePenalty = getOvertimePenalty(candidate, shift);
  const fatiguePenalty = getFatiguePenalty(candidate);

  const positiveScore =
    acceptanceScore * SCORING_CONFIG.weights.acceptance +
    responseSpeedScore * SCORING_CONFIG.weights.responseSpeed +
    seniorityScore * SCORING_CONFIG.weights.seniority +
    attendanceScore * SCORING_CONFIG.weights.attendance +
    fairnessAdjustment;

  const finalScore = clamp(
    positiveScore - overtimePenalty - fatiguePenalty,
    0,
    100,
  );

  return {
    acceptanceScore: Math.round(acceptanceScore),
    responseSpeedScore: Math.round(responseSpeedScore),
    seniorityScore: Math.round(seniorityScore),
    attendanceScore: Math.round(attendanceScore),
    fairnessAdjustment: Math.round(fairnessAdjustment),
    overtimePenalty: Math.round(overtimePenalty),
    fatiguePenalty: Math.round(fatiguePenalty),
    finalScore: Math.round(finalScore),
  };
}