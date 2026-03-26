/*
  Warnings:

  - You are about to drop the column `managerOverride` on the `ScenarioRun` table. All the data in the column will be lost.
  - You are about to alter the column `predictedFillProbability` on the `ScenarioRun` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - Added the required column `updatedAt` to the `Candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rankingSnapshot` to the `ScenarioRun` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Shift` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Candidate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "certifications" TEXT NOT NULL,
    "unitsQualified" TEXT NOT NULL,
    "facilitiesQualified" TEXT NOT NULL,
    "weeklyHours" REAL NOT NULL,
    "overtimeHours" REAL NOT NULL,
    "seniorityScore" REAL NOT NULL,
    "recentAcceptRate" REAL NOT NULL,
    "recentResponseMinutes" REAL NOT NULL,
    "attendanceScore" REAL NOT NULL,
    "fatigueRisk" REAL NOT NULL,
    "channelPreferences" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL,
    "recentOutreachCount" INTEGER NOT NULL,
    "lastShiftEndedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Candidate" ("attendanceScore", "certifications", "channelPreferences", "createdAt", "facilitiesQualified", "fatigueRisk", "id", "isAvailable", "lastShiftEndedAt", "name", "overtimeHours", "recentAcceptRate", "recentOutreachCount", "recentResponseMinutes", "role", "seniorityScore", "unitsQualified", "weeklyHours") SELECT "attendanceScore", "certifications", "channelPreferences", "createdAt", "facilitiesQualified", "fatigueRisk", "id", "isAvailable", "lastShiftEndedAt", "name", "overtimeHours", "recentAcceptRate", "recentOutreachCount", "recentResponseMinutes", "role", "seniorityScore", "unitsQualified", "weeklyHours" FROM "Candidate";
DROP TABLE "Candidate";
ALTER TABLE "new_Candidate" RENAME TO "Candidate";
CREATE TABLE "new_ScenarioRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shiftId" TEXT NOT NULL,
    "predictedFillProbability" INTEGER NOT NULL,
    "recommendedSequence" TEXT NOT NULL,
    "rankingSnapshot" TEXT NOT NULL,
    "managerOverrideCandidateId" TEXT,
    "managerOverrideReason" TEXT,
    "finalOutcome" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ScenarioRun_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ScenarioRun" ("createdAt", "finalOutcome", "id", "predictedFillProbability", "recommendedSequence", "shiftId") SELECT "createdAt", "finalOutcome", "id", "predictedFillProbability", "recommendedSequence", "shiftId" FROM "ScenarioRun";
DROP TABLE "ScenarioRun";
ALTER TABLE "new_ScenarioRun" RENAME TO "ScenarioRun";
CREATE TABLE "new_Shift" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "facility" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "requiredCertifications" TEXT NOT NULL,
    "priorityLevel" TEXT NOT NULL,
    "overtimeAllowed" BOOLEAN NOT NULL,
    "unionRuleset" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Shift" ("createdAt", "endTime", "facility", "id", "overtimeAllowed", "priorityLevel", "requiredCertifications", "role", "startTime", "title", "unionRuleset", "unit") SELECT "createdAt", "endTime", "facility", "id", "overtimeAllowed", "priorityLevel", "requiredCertifications", "role", "startTime", "title", "unionRuleset", "unit" FROM "Shift";
DROP TABLE "Shift";
ALTER TABLE "new_Shift" RENAME TO "Shift";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
