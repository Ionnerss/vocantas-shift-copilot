import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma";
import { demoCandidates, demoShifts } from "../src/lib/demo-data";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

function json(value: unknown) {
  return JSON.stringify(value);
}

async function main() {
  for (const shift of demoShifts) {
    await prisma.shift.upsert({
      where: { id: shift.id },
      update: {
        title: shift.title,
        unit: shift.unit,
        facility: shift.facility,
        role: shift.role,
        startTime: shift.startTime,
        endTime: shift.endTime,
        requiredCertifications: json(shift.requiredCertifications),
        priorityLevel: shift.priorityLevel,
        overtimeAllowed: shift.overtimeAllowed,
        unionRuleset: shift.unionRuleset,
      },
      create: {
        id: shift.id,
        title: shift.title,
        unit: shift.unit,
        facility: shift.facility,
        role: shift.role,
        startTime: shift.startTime,
        endTime: shift.endTime,
        requiredCertifications: json(shift.requiredCertifications),
        priorityLevel: shift.priorityLevel,
        overtimeAllowed: shift.overtimeAllowed,
        unionRuleset: shift.unionRuleset,
      },
    });
  }

  for (const candidate of demoCandidates) {
    await prisma.candidate.upsert({
      where: { id: candidate.id },
      update: {
        name: candidate.name,
        role: candidate.role,
        certifications: json(candidate.certifications),
        unitsQualified: json(candidate.unitsQualified),
        facilitiesQualified: json(candidate.facilitiesQualified),
        weeklyHours: candidate.weeklyHours,
        overtimeHours: candidate.overtimeHours,
        seniorityScore: candidate.seniorityScore,
        recentAcceptRate: candidate.recentAcceptRate,
        recentResponseMinutes: candidate.recentResponseMinutes,
        attendanceScore: candidate.attendanceScore,
        fatigueRisk: candidate.fatigueRisk,
        channelPreferences: json(candidate.channelPreferences),
        isAvailable: candidate.isAvailable,
        recentOutreachCount: candidate.recentOutreachCount,
        lastShiftEndedAt: candidate.lastShiftEndedAt,
      },
      create: {
        id: candidate.id,
        name: candidate.name,
        role: candidate.role,
        certifications: json(candidate.certifications),
        unitsQualified: json(candidate.unitsQualified),
        facilitiesQualified: json(candidate.facilitiesQualified),
        weeklyHours: candidate.weeklyHours,
        overtimeHours: candidate.overtimeHours,
        seniorityScore: candidate.seniorityScore,
        recentAcceptRate: candidate.recentAcceptRate,
        recentResponseMinutes: candidate.recentResponseMinutes,
        attendanceScore: candidate.attendanceScore,
        fatigueRisk: candidate.fatigueRisk,
        channelPreferences: json(candidate.channelPreferences),
        isAvailable: candidate.isAvailable,
        recentOutreachCount: candidate.recentOutreachCount,
        lastShiftEndedAt: candidate.lastShiftEndedAt,
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });