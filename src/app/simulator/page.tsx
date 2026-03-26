"use client";

import { useEffect, useMemo, useState } from "react";
import { AnalyticsOverview } from "@/components/analytics/analytics-overview";
import { ManagerOverridePanel } from "@/components/simulator/manager-override-panel";
import { ScenarioBuilder } from "@/components/simulator/scenario-builder";
import { rankCandidates } from "@/features/ranking/ranking.service";
import { demoCandidates, demoShifts } from "@/lib/demo-data";
import { PriorityLevel } from "@/types/domain";

type SavedRun = {
  id: string;
  shiftTitle: string;
  predictedFillProbability: number;
  recommendedSequence: string[];
  managerOverrideCandidateId: string | null;
  managerOverrideReason: string | null;
  finalOutcome: string | null;
  createdAt: string;
};

export default function SimulatorPage() {
  const [selectedShiftId, setSelectedShiftId] = useState(demoShifts[0].id);
  const [priorityLevel, setPriorityLevel] = useState<PriorityLevel>(demoShifts[0].priorityLevel);
  const [overtimeAllowed, setOvertimeAllowed] = useState(demoShifts[0].overtimeAllowed);
  const [availableOnly, setAvailableOnly] = useState(true);
  const [overrideCandidateId, setOverrideCandidateId] = useState("");
  const [overrideReason, setOverrideReason] = useState("");
  const [savedRuns, setSavedRuns] = useState<SavedRun[]>([]);
  const [saveMessage, setSaveMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const selected = demoShifts.find((shift) => shift.id === selectedShiftId);
    if (!selected) return;

    setPriorityLevel(selected.priorityLevel);
    setOvertimeAllowed(selected.overtimeAllowed);
    setOverrideCandidateId("");
    setOverrideReason("");
  }, [selectedShiftId]);

  useEffect(() => {
    loadSavedRuns();
  }, []);

  async function loadSavedRuns() {
    try {
      const response = await fetch("/api/scenarios", { cache: "no-store" });
      if (!response.ok) return;

      const data = (await response.json()) as SavedRun[];
      setSavedRuns(data);
    } catch (error) {
      console.error("Failed to load saved runs:", error);
    }
  }

  const currentShift = useMemo(() => {
    const base = demoShifts.find((shift) => shift.id === selectedShiftId) ?? demoShifts[0];

    return {
      ...base,
      priorityLevel,
      overtimeAllowed,
    };
  }, [selectedShiftId, priorityLevel, overtimeAllowed]);

  const candidatePool = useMemo(() => {
    return availableOnly
      ? demoCandidates.filter((candidate) => candidate.isAvailable)
      : demoCandidates;
  }, [availableOnly]);

  const result = useMemo(() => {
    return rankCandidates(currentShift, candidatePool);
  }, [currentShift, candidatePool]);

  const finalSequence = useMemo(() => {
    if (!overrideCandidateId) return result.recommendedSequence;

    const overrideCandidate = result.rankings.find(
      (ranking) =>
        ranking.candidate.id === overrideCandidateId && ranking.eligible,
    );

    if (!overrideCandidate) return result.recommendedSequence;

    const remaining = result.recommendedSequence.filter(
      (ranking) => ranking.candidate.id !== overrideCandidateId,
    );

    return [overrideCandidate, ...remaining].slice(0, 3);
  }, [overrideCandidateId, result.rankings, result.recommendedSequence]);

  async function handleSaveScenario() {
    try {
      setIsSaving(true);
      setSaveMessage("");

      const response = await fetch("/api/scenarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shift: currentShift,
          predictedFillProbability: result.predictedFillProbability,
          recommendedSequence: finalSequence.map((item) => item.candidate.name),
          rankings: result.rankings.map((ranking) => ({
            candidateId: ranking.candidate.id,
            candidateName: ranking.candidate.name,
            eligible: ranking.eligible,
            finalScore: ranking.fitScore.finalScore,
            fillLikelihood: ranking.fillLikelihood,
            recommendedChannel: ranking.recommendedChannel,
            explanation: ranking.explanation,
          })),
          managerOverrideCandidateId: overrideCandidateId || null,
          managerOverrideReason: overrideReason.trim() || null,
          finalOutcome: "pending",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save scenario");
      }

      setSaveMessage("Scenario saved.");
      await loadSavedRuns();
    } catch (error) {
      console.error(error);
      setSaveMessage("Failed to save scenario.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
              Vocantas Shift Fill Decision Copilot
            </span>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
              {currentShift.facility}
            </span>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
              {currentShift.unit}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold">{currentShift.title}</h1>
          <p className="mt-2 text-slate-300">
            {currentShift.role} • {currentShift.startTime.toLocaleString()} →{" "}
            {currentShift.endTime.toLocaleString()}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Predicted fill probability</p>
              <p className="mt-2 text-3xl font-bold text-emerald-300">
                {result.predictedFillProbability}%
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Eligible candidates</p>
              <p className="mt-2 text-3xl font-bold">
                {result.rankings.filter((ranking) => ranking.eligible).length}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 md:col-span-2">
              <p className="text-sm text-slate-400">Final outreach sequence</p>
              <p className="mt-2 text-lg font-semibold">
                {finalSequence.map((item) => item.candidate.name).join(" → ")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <ScenarioBuilder
            shifts={demoShifts}
            selectedShiftId={selectedShiftId}
            onSelectShiftId={setSelectedShiftId}
            priorityLevel={priorityLevel}
            onPriorityChange={setPriorityLevel}
            overtimeAllowed={overtimeAllowed}
            onOvertimeChange={setOvertimeAllowed}
            availableOnly={availableOnly}
            onAvailableOnlyChange={setAvailableOnly}
          />

          <ManagerOverridePanel
            rankings={result.rankings}
            overrideCandidateId={overrideCandidateId}
            overrideReason={overrideReason}
            onOverrideCandidateIdChange={setOverrideCandidateId}
            onOverrideReasonChange={setOverrideReason}
            onClearOverride={() => {
              setOverrideCandidateId("");
              setOverrideReason("");
            }}
          />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Save decision run</h2>
              <p className="mt-2 text-sm text-slate-400">
                Store the current recommendation so you can show scenario history and manager overrides.
              </p>
            </div>

            <button
              onClick={handleSaveScenario}
              disabled={isSaving}
              className="rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save current run"}
            </button>
          </div>

          {saveMessage ? (
            <p className="mt-4 text-sm text-emerald-300">{saveMessage}</p>
          ) : null}
        </div>

        <AnalyticsOverview runs={savedRuns} />

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Candidate rankings</h2>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-sm text-slate-400">
                  <th className="pb-2">Candidate</th>
                  <th className="pb-2">Eligible</th>
                  <th className="pb-2">Final score</th>
                  <th className="pb-2">Fill likelihood</th>
                  <th className="pb-2">Channel</th>
                  <th className="pb-2">Why</th>
                </tr>
              </thead>
              <tbody>
                {result.rankings.map((ranked) => (
                  <tr key={ranked.candidate.id} className="bg-slate-950">
                    <td className="rounded-l-xl px-4 py-4 font-medium">
                      {ranked.candidate.name}
                    </td>
                    <td className="px-4 py-4">
                      {ranked.eligible ? (
                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
                          Yes
                        </span>
                      ) : (
                        <span className="rounded-full bg-rose-500/10 px-3 py-1 text-sm text-rose-300">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">{ranked.fitScore.finalScore}</td>
                    <td className="px-4 py-4">{ranked.fillLikelihood}%</td>
                    <td className="px-4 py-4">{ranked.recommendedChannel ?? "—"}</td>
                    <td className="rounded-r-xl px-4 py-4 text-sm text-slate-300">
                      <ul className="space-y-1">
                        {ranked.explanation.map((line) => (
                          <li key={line}>• {line}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}