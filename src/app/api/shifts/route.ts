import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapDbShiftToDomain } from "@/lib/db-mappers";

export async function GET() {
  try {
    const shifts = await prisma.shift.findMany({
      orderBy: { startTime: "asc" },
    });

    const data = shifts.map(mapDbShiftToDomain);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch shifts:", error);

    return NextResponse.json(
      { message: "Failed to fetch shifts." },
      { status: 500 },
    );
  }
}