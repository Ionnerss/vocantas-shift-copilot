-- CreateTable
CREATE TABLE "Shift" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Candidate" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ScenarioRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shiftId" TEXT NOT NULL,
    "predictedFillProbability" REAL NOT NULL,
    "recommendedSequence" TEXT NOT NULL,
    "managerOverride" TEXT,
    "finalOutcome" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ScenarioRun_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
