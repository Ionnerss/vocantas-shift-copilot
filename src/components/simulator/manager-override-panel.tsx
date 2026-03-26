"use client";

import { RankedCandidate } from "@/types/domain";

type Props = {
  rankings: RankedCandidate[];
  overrideCandidateId: string;
  overrideReason: string;
  onOverrideCandidateIdChange: (value: string) => void;
  onOverrideReasonChange: (value: string) => void;
  onClearOverride: () => void;
};

export function ManagerOverridePanel({
  rankings,
  overrideCandidateId,
  overrideReason,
  onOverrideCandidateIdChange,
  onOverrideReasonChange,
  onClearOverride,
}: Props) {
  const eligibleRankings = rankings.filter((ranking) => ranking.eligible);
  const topRecommendation = eligibleRankings[0];

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-2xl font-semibold text-slate-100">Manager override</h2>
      <p className="mt-2 text-sm text-slate-400">
        Keep the AI recommendation or force a human override and save the reason.
      </p>

      <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
        <p className="text-sm text-slate-300">Current top AI recommendation</p>
        <p className="mt-1 text-lg font-semibold text-emerald-300">
          {topRecommendation
            ? `${topRecommendation.candidate.name} (${topRecommendation.fillLikelihood}% fill likelihood)`
            : "No eligible candidate"}
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">Override candidate</span>
          <select
            value={overrideCandidateId}
            onChange={(e) => onOverrideCandidateIdChange(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none"
          >
            <option value="">No override</option>
            {eligibleRankings.map((ranking) => (
              <option key={ranking.candidate.id} value={ranking.candidate.id}>
                {ranking.candidate.name} — score {ranking.fitScore.finalScore}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">Override reason</span>
          <textarea
            value={overrideReason}
            onChange={(e) => onOverrideReasonChange(e.target.value)}
            placeholder="Example: senior nurse requested first contact due to known preference and faster callback reliability."
            rows={4}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none"
          />
        </label>

        <button
          onClick={onClearOverride}
          className="w-fit rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
        >
          Clear override
        </button>
      </div>
    </section>
  );
}