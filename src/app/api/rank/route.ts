import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapDbCandidateToDomain, mapDbShiftToDomain } from "@/lib/db-mappers";
import { rankCandidates } from "@/features/ranking/ranking.service";
import { Candidate, Shift } from "@/types/domain";

type RankRequestBody = {
  shiftId?: string;
  shift?: Shift;
  candidates?: Candidate[];
  availableOnly?: boolean;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RankRequestBody;

    let shift: Shift | null = null;

    if (body.shift) {
      shift = {
        ...body.shift,
        startTime: new Date(body.shift.startTime),
        endTime: new Date(body.shift.endTime),
      };
    } else if (body.shiftId) {
      const dbShift = await prisma.shift.findUnique({
        where: { id: body.shiftId },
      });

      if (!dbShift) {
        return NextResponse.json(
          { message: "Shift not found." },
          { status: 404 },
          );
      }

      shift = mapDbShiftToDomain(dbShift);
    }

    if (!shift) {
      return NextResponse.json(
        { message: "A shift or shiftId is required." },
        { status: 400 },
      );
    }

    let candidates: Candidate[];

    if (body.candidates && body.candidates.length > 0) {
      candidates = body.candidates.map((candidate) => ({
        ...candidate,
        lastShiftEndedAt: candidate.lastShiftEndedAt
          ? new Date(candidate.lastShiftEndedAt)
          : null,
      }));
    } else {
      const dbCandidates = await prisma.candidate.findMany({
        orderBy: { name: "asc" },
      });

      candidates = dbCandidates.map(mapDbCandidateToDomain);
    }

    if (body.availableOnly) {
      candidates = candidates.filter((candidate) => candidate.isAvailable);
    }

    const result = rankCandidates(shift, candidates);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to rank candidates:", error);

    return NextResponse.json( {message: "Failed to rank candidates."}, 
      { status: 500 },
    );
  }
}