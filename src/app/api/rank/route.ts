import { NextRequest, NextResponse } from "next/server";
import { rankCandidates } from "@/features/ranking/ranking.service";
import { demoCandidates, demoShift } from "@/lib/demo-data";
import { Candidate, Shift } from "@/types/domain";

function reviveShift(raw: Record<string, unknown>): Shift {
  return {
    id: String(raw.id),
    title: String(raw.title),
    unit: String(raw.unit),
    facility: String(raw.facility),
    role: String(raw.role),
    startTime: new Date(String(raw.startTime)),
    endTime: new Date(String(raw.endTime)),
    requiredCertifications: Array.isArray(raw.requiredCertifications)
      ? raw.requiredCertifications.map(String)
      : [],
    priorityLevel: raw.priorityLevel as Shift["priorityLevel"],
    overtimeAllowed: Boolean(raw.overtimeAllowed),
    unionRuleset: String(raw.unionRuleset),
  };
}

function reviveCandidate(raw: Record<string, unknown>): Candidate {
  return {
    id: String(raw.id),
    name: String(raw.name),
    role: String(raw.role),
    certifications: Array.isArray(raw.certifications)
      ? raw.certifications.map(String)
      : [],
    unitsQualified: Array.isArray(raw.unitsQualified)
      ? raw.unitsQualified.map(String)
      : [],
    facilitiesQualified: Array.isArray(raw.facilitiesQualified)
      ? raw.facilitiesQualified.map(String)
      : [],
    weeklyHours: Number(raw.weeklyHours),
    overtimeHours: Number(raw.overtimeHours),
    seniorityScore: Number(raw.seniorityScore),
    recentAcceptRate: Number(raw.recentAcceptRate),
    recentResponseMinutes: Number(raw.recentResponseMinutes),
    attendanceScore: Number(raw.attendanceScore),
    fatigueRisk: Number(raw.fatigueRisk),
    channelPreferences: Array.isArray(raw.channelPreferences)
      ? (raw.channelPreferences.map(String) as Candidate["channelPreferences"])
      : [],
    isAvailable: Boolean(raw.isAvailable),
    recentOutreachCount: Number(raw.recentOutreachCount),
    lastShiftEndedAt: raw.lastShiftEndedAt
      ? new Date(String(raw.lastShiftEndedAt))
      : null,
  };
}

export async function GET() {
  const result = rankCandidates(demoShift, demoCandidates);
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      shift?: Record<string, unknown>;
      candidates?: Record<string, unknown>[];
    };

    const shift = body.shift ? reviveShift(body.shift) : demoShift;
    const candidates = Array.isArray(body.candidates)
      ? body.candidates.map(reviveCandidate)
      : demoCandidates;

    const result = rankCandidates(shift, candidates);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Ranking error:", error);

    return NextResponse.json(
      { message: "Failed to generate ranking." },
      { status: 500 },
    );
  }
}