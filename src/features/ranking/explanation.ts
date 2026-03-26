import { Candidate, CandidateScoreBreakdown, Shift } from "@/types/domain";

export function buildExplanation(
  shift: Shift,
  candidate: Candidate,
  fitScore: CandidateScoreBreakdown,
): string[] {
  const notes: string[] = [];

  notes.push(`Qualified for ${shift.unit} at ${shift.facility}`);

  if (fitScore.acceptanceScore >= 80) {
    notes.push("High recent shift acceptance rate");
  } else if (fitScore.acceptanceScore < 65) {
    notes.push("Lower recent acceptance trend");
  }

  if (fitScore.responseSpeedScore >= 80) {
    notes.push("Fast historical response speed");
  } else if (fitScore.responseSpeedScore < 50) {
    notes.push("Slower than ideal response speed");
  }

  if (fitScore.attendanceScore >= 90) {
    notes.push("Strong attendance reliability");
  }

  if (fitScore.fairnessAdjustment >= 12) {
    notes.push("Fairness boost: low recent outreach load");
  }

  if (fitScore.overtimePenalty > 0) {
    notes.push("Penalty applied for projected overtime");
  }

  if (fitScore.fatiguePenalty >= 15) {
    notes.push("Penalty applied for elevated fatigue risk");
  }

  if (candidate.channelPreferences.length > 0) {
    notes.push(`Preferred channels: ${candidate.channelPreferences.join(", ")}`);
  }

  return notes;
}