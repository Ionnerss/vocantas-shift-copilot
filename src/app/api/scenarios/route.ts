import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stringifyJson } from "@/lib/json";

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

export async function GET() {
  try {
    const runs = await prisma.scenarioRun.findMany({
      include: { shift: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json(
      runs.map((run) => ({
        id: run.id,
        shiftId: run.shiftId,
        shiftTitle: run.shift.title,
        shiftUnit: run.shift.unit,
        shiftFacility: run.shift.facility,
        predictedFillProbability: run.predictedFillProbability,
        recommendedSequence: JSON.parse(run.recommendedSequence) as string[],
        rankingSnapshot: JSON.parse(run.rankingSnapshot),
        managerOverrideCandidateId: run.managerOverrideCandidateId,
        managerOverrideReason: run.managerOverrideReason,
        finalOutcome: run.finalOutcome,
        createdAt: run.createdAt.toISOString(),
      })),
    );
  } catch (error) {
    console.error("Failed to fetch scenarios:", error);

    return NextResponse.json(
      { message: "Failed to fetch scenarios." },
      { status: 500 },
    );
  }
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
        requiredCertifications: stringifyJson(body.shift.requiredCertifications),
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
        requiredCertifications: stringifyJson(body.shift.requiredCertifications),
        priorityLevel: body.shift.priorityLevel,
        overtimeAllowed: body.shift.overtimeAllowed,
        unionRuleset: body.shift.unionRuleset,
      },
    });

    const run = await prisma.scenarioRun.create({
      data: {
        shiftId: body.shift.id,
        predictedFillProbability: Math.round(body.predictedFillProbability),
        recommendedSequence: stringifyJson(body.recommendedSequence ?? []),
        rankingSnapshot: stringifyJson(body.rankings ?? []),
        managerOverrideCandidateId: body.managerOverrideCandidateId ?? null,
        managerOverrideReason: body.managerOverrideReason ?? null,
        finalOutcome: body.finalOutcome ?? "pending",
      },
    });

    return NextResponse.json({ ok: true, id: run.id });
  } catch (error) {
    console.error("Failed to save scenario:", error);

    return NextResponse.json(
      { message: "Failed to save scenario." },
      { status: 500 },
    );
  }
}