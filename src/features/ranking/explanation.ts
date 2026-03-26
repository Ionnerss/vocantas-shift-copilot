import { Candidate, CandidateScoreBreakdown, Shift } from "@/types/domain";

function getProjectedHours(shift: Shift, candidate: Candidate): number {
  const shiftHours =
    (shift.endTime.getTime() - shift.startTime.getTime()) / (1000 * 60 * 60);

  return candidate.weeklyHours + shiftHours;
}

function getRestHours(lastShiftEndedAt: Date | null, shiftStart: Date): number | null {
  if (!lastShiftEndedAt) return null;

  const diffMs = shiftStart.getTime() - lastShiftEndedAt.getTime();
  return diffMs / (1000 * 60 * 60);
}

export function buildExplanation(
  shift: Shift,
  candidate: Candidate,
  fitScore: CandidateScoreBreakdown,
): string[] {
  const notes: string[] = [];

  notes.push(`Qualified for ${shift.unit} at ${shift.facility}`);

  if (candidate.certifications.length > shift.requiredCertifications.length) {
    notes.push("Has additional certifications beyond the minimum requirement");
  }

  if (fitScore.acceptanceScore >= 85) {
    notes.push("Very strong recent shift acceptance rate");
  } else if (fitScore.acceptanceScore >= 70) {
    notes.push("Solid recent shift acceptance trend");
  } else {
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
  } else if (candidate.recentOutreachCount >= 3) {
    notes.push("Has been contacted frequently in recent scenarios");
  }

  const projectedHours = getProjectedHours(shift, candidate);
  notes.push(`Projected weekly hours after assignment: ${projectedHours.toFixed(1)}`);

  const restHours = getRestHours(candidate.lastShiftEndedAt, shift.startTime);
  if (restHours !== null) {
    notes.push(`Rest window before shift: ${restHours.toFixed(1)} hours`);
  }

  if (fitScore.overtimePenalty > 0) {
    notes.push("Penalty applied for projected overtime");
  }

  if (fitScore.fatiguePenalty >= 15) {
    notes.push("Penalty applied for elevated fatigue risk");
  } else if (candidate.fatigueRisk <= 0.25) {
    notes.push("Low fatigue risk profile");
  }

  if (candidate.channelPreferences.length > 0) {
    notes.push(`Preferred channels: ${candidate.channelPreferences.join(", ")}`);
  }

  return notes;
}