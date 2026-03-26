export const SCORING_CONFIG = {
  maxWeeklyHours: 40,
  minRestHours: 8,
  fatigueCutoff: 0.9,
  weights: {
    acceptance: 0.32,
    responseSpeed: 0.18,
    seniority: 0.12,
    attendance: 0.18,
  },
  fairness: {
    outreachBoostBase: 16,
    outreachDecayPerRecentTouch: 4,
  },
  penalties: {
    overtimePerHour: 4,
    fatigueMultiplier: 25,
  },
  fillProbability: {
    topN: 3,
    scoreWeight: 0.7,
    acceptRateWeight: 0.3,
  },
} as const;