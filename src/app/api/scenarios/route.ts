import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type SaveScenarioBody = {
  shift: {
    id: string;
    title: string;
    unit: string;
    facility: string;
    role: string;
    startTime: string;
    endTime: string;
    requiredCertifications: string[];
    priorityLevel: string;
    overtimeAllowed: boolean;
    unionRuleset: string;
  };
  predictedFillProbability: number;
  recommendedSequence: string[];
  rankings: Array<{
    candidateId: string;
    candidateName: string;
    eligible: boolean;
    finalScore: number;
    fillLikelihood: number;
    recommendedChannel: string | null;
    explanation: string[];
  }>;
  managerOverrideCandidateId?: string | null;
  managerOverrideReason?: string | null;
  finalOutcome?: string | null;
};

function json(value: unknown) {
  return JSON.stringify(value);
}

export async function GET() {
  const runs = await prisma.scenarioRun.findMany({
    include: { shift: true },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return NextResponse.json(
    runs.map((run) => ({
      id: run.id,
      shiftTitle: run.shift.title,
      predictedFillProbability: run.predictedFillProbability,
      recommendedSequence: JSON.parse(run.recommendedSequence) as string[],
      managerOverrideCandidateId: run.managerOverrideCandidateId,
      managerOverrideReason: run.managerOverrideReason,
      finalOutcome: run.finalOutcome,
      createdAt: run.createdAt.toISOString(),
    })),
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SaveScenarioBody;

    if (!body.shift?.id) {
      return NextResponse.json(
        { message: "Shift payload is required." },
        { status: 400 },
      );
    }

    await prisma.shift.upsert({
      where: { id: body.shift.id },
      update: {
        title: body.shift.title,
        unit: body.shift.unit,
        facility: body.shift.facility,
        role: body.shift.role,
        startTime: new Date(body.shift.startTime),
        endTime: new Date(body.shift.endTime),
        requiredCertifications: json(body.shift.requiredCertifications),
        priorityLevel: body.shift.priorityLevel,
        overtimeAllowed: body.shift.overtimeAllowed,
        unionRuleset: body.shift.unionRuleset,
      },
      create: {
        id: body.shift.id,
        title: body.shift.title,
        unit: body.shift.unit,
        facility: body.shift.facility,
        role: body.shift.role,
        startTime: new Date(body.shift.startTime),
        endTime: new Date(body.shift.endTime),
        requiredCertifications: json(body.shift.requiredCertifications),
        priorityLevel: body.shift.priorityLevel,
        overtimeAllowed: body.shift.overtimeAllowed,
        unionRuleset: body.shift.unionRuleset,
      },
    });

    const run = await prisma.scenarioRun.create({
      data: {
        shiftId: body.shift.id,
        predictedFillProbability: Math.round(body.predictedFillProbability),
        recommendedSequence: json(body.recommendedSequence ?? []),
        rankingSnapshot: json(body.rankings ?? []),
        managerOverrideCandidateId: body.managerOverrideCandidateId ?? null,
        managerOverrideReason: body.managerOverrideReason ?? null,
        finalOutcome: body.finalOutcome ?? "pending",
      },
    });

    return NextResponse.json({
      ok: true,
      id: run.id,
    });
  } catch (error) {
    console.error("Failed to save scenario run:", error);

    return NextResponse.json(
      { message: "Failed to save scenario run." },
      { status: 500 },
    );
  }
}