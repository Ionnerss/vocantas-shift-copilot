export type Channel = "SMS" | "IVR" | "APP" | "EMAIL";
export type PriorityLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Shift {
  id: string;
  title: string;
  unit: string;
  facility: string;
  role: string;
  startTime: Date;
  endTime: Date;
  requiredCertifications: string[];
  priorityLevel: PriorityLevel;
  overtimeAllowed: boolean;
  unionRuleset: string;
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  certifications: string[];
  unitsQualified: string[];
  facilitiesQualified: string[];
  weeklyHours: number;
  overtimeHours: number;
  seniorityScore: number; // 0-100
  recentAcceptRate: number; // 0-100
  recentResponseMinutes: number;
  attendanceScore: number; // 0-100
  fatigueRisk: number; // 0.0-1.0
  channelPreferences: Channel[];
  isAvailable: boolean;
  recentOutreachCount: number;
  lastShiftEndedAt: Date | null;
}

export interface HardRuleResult {
  eligible: boolean;
  failures: string[];
}

export interface CandidateScoreBreakdown {
  acceptanceScore: number;
  responseSpeedScore: number;
  seniorityScore: number;
  attendanceScore: number;
  fairnessAdjustment: number;
  overtimePenalty: number;
  fatiguePenalty: number;
  finalScore: number;
}

export interface RankedCandidate {
  candidate: Candidate;
  eligible: boolean;
  failures: string[];
  recommendedChannel: Channel | null;
  fitScore: CandidateScoreBreakdown;
  fillLikelihood: number; // 0-100
  explanation: string[];
}

export interface RecommendationResult {
  shift: Shift;
  rankings: RankedCandidate[];
  recommendedSequence: RankedCandidate[];
  predictedFillProbability: number; // 0-100
}