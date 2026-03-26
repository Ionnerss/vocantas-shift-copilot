import { SCORING_CONFIG } from "@/lib/scoring-config";
import { Candidate, HardRuleResult, Shift } from "@/types/domain";

function hasAllCertifications(
  required: string[],
  candidateCertifications: string[],
): boolean {
  return required.every((cert) => candidateCertifications.includes(cert));
}

function getRestHours(lastShiftEndedAt: Date | null, shiftStart: Date): number | null {
  if (!lastShiftEndedAt) return null;
  const diffMs = shiftStart.getTime() - lastShiftEndedAt.getTime();
  return diffMs / (1000 * 60 * 60);
}

export function evaluateHardRules(shift: Shift, candidate: Candidate): HardRuleResult {
  const failures: string[] = [];

  if (candidate.role !== shift.role) {
    failures.push("Role mismatch");
  }

  if (!candidate.isAvailable) {
    failures.push("Candidate unavailable");
  }

  if (!hasAllCertifications(shift.requiredCertifications, candidate.certifications)) {
    failures.push("Missing required certifications");
  }

  if (!candidate.unitsQualified.includes(shift.unit)) {
    failures.push("Not qualified for unit");
  }

  if (!candidate.facilitiesQualified.includes(shift.facility)) {
    failures.push("Not qualified for facility");
  }

  const restHours = getRestHours(candidate.lastShiftEndedAt, shift.startTime);
  if (restHours !== null && restHours < SCORING_CONFIG.minRestHours) {
    failures.push(`Insufficient rest window (${restHours.toFixed(1)}h)`);
  }

  if (!shift.overtimeAllowed && candidate.weeklyHours >= SCORING_CONFIG.maxWeeklyHours) {
    failures.push("Overtime not allowed");
  }

  if (candidate.fatigueRisk >= SCORING_CONFIG.fatigueCutoff) {
    failures.push("Fatigue risk above safety cutoff");
  }

  return {
    eligible: failures.length === 0,
    failures,
  };
}