import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapDbCandidateToDomain } from "@/lib/db-mappers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const availableOnly = searchParams.get("availableOnly") === "true";
    const unit = searchParams.get("unit");
    const facility = searchParams.get("facility");
    const role = searchParams.get("role");

    const candidates = await prisma.candidate.findMany({
      orderBy: { name: "asc" },
    });

    let data = candidates.map(mapDbCandidateToDomain);

    if (availableOnly) {
      data = data.filter((candidate) => candidate.isAvailable);
    }

    if (unit) {
      data = data.filter((candidate) =>
        candidate.unitsQualified.includes(unit),
      );
    }

    if (facility) {
      data = data.filter((candidate) =>
        candidate.facilitiesQualified.includes(facility),
      );
    }

    if (role) {
        data = data.filter((candidate) => candidate.role === role);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch candidates:", error);

    return NextResponse.json(
      { message: "Failed to fetch candidates." },
      { status: 500 },
    );
  }
}