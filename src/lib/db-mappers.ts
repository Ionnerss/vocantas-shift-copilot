import { Candidate, PriorityLevel, Shift } from "@/types/domain";
import { parseJsonArray } from "@/lib/json";

type DbShift = {
  id: string;
  title: string;
  unit: string;
  facility: string;
  role: string;
  startTime: Date;
  endTime: Date;
  requiredCertifications: string;
  priorityLevel: string;
  overtimeAllowed: boolean;
  unionRuleset: string;
};

type DbCandidate = {
  id: string;
  name: string;
  role: string;
  certifications: string;
  unitsQualified: string;
  facilitiesQualified: string;
  weeklyHours: number;
  overtimeHours: number;
  seniorityScore: number;
  recentAcceptRate: number;
  recentResponseMinutes: number;
  attendanceScore: number;
  fatigueRisk: number;
  channelPreferences: string;
  isAvailable: boolean;
  recentOutreachCount: number;
  lastShiftEndedAt: Date | null;
};

export function mapDbShiftToDomain(shift: DbShift): Shift {
  return {
    id: shift.id,
    title: shift.title,
    unit: shift.unit,
    facility: shift.facility,
    role: shift.role,
    startTime: new Date(shift.startTime),
    endTime: new Date(shift.endTime),
    requiredCertifications: parseJsonArray<string>(shift.requiredCertifications),
    priorityLevel: shift.priorityLevel as PriorityLevel,
    overtimeAllowed: shift.overtimeAllowed,
    unionRuleset: shift.unionRuleset,
  };
}

export function mapDbCandidateToDomain(candidate: DbCandidate): Candidate {
  return {
    id: candidate.id,
    name: candidate.name,
    role: candidate.role,
    certifications: parseJsonArray<string>(candidate.certifications),
    unitsQualified: parseJsonArray<string>(candidate.unitsQualified),
    facilitiesQualified: parseJsonArray<string>(candidate.facilitiesQualified),
    weeklyHours: candidate.weeklyHours,
    overtimeHours: candidate.overtimeHours,
    seniorityScore: candidate.seniorityScore,
    recentAcceptRate: candidate.recentAcceptRate,
    recentResponseMinutes: candidate.recentResponseMinutes,
    attendanceScore: candidate.attendanceScore,
    fatigueRisk: candidate.fatigueRisk,
    channelPreferences: parseJsonArray<Candidate["channelPreferences"][number]>(
      candidate.channelPreferences,
    ),
    isAvailable: candidate.isAvailable,
    recentOutreachCount: candidate.recentOutreachCount,
    lastShiftEndedAt: candidate.lastShiftEndedAt
      ? new Date(candidate.lastShiftEndedAt) : null,
    };
}