"use client";

import { PriorityLevel, Shift } from "@/types/domain";

type Props = {
  shifts: Shift[];
  selectedShiftId: string;
  onSelectShiftId: (value: string) => void;
  priorityLevel: PriorityLevel;
  onPriorityChange: (value: PriorityLevel) => void;
  overtimeAllowed: boolean;
  onOvertimeChange: (value: boolean) => void;
  availableOnly: boolean;
  onAvailableOnlyChange: (value: boolean) => void;
};

const PRIORITIES: PriorityLevel[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export function ScenarioBuilder({
  shifts,
  selectedShiftId,
  onSelectShiftId,
  priorityLevel,
  onPriorityChange,
  overtimeAllowed,
  onOvertimeChange,
  availableOnly,
  onAvailableOnlyChange,
}: Props) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-2xl font-semibold text-slate-100">Scenario builder</h2>
      <p className="mt-2 text-sm text-slate-400">
        Pick a demo shift, adjust urgency, and control the candidate pool.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">Scenario</span>
          <select
            value={selectedShiftId}
            onChange={(e) => onSelectShiftId(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none"
          >
            {shifts.map((shift) => (
              <option key={shift.id} value={shift.id}>
                {shift.title} — {shift.unit}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">Priority</span>
          <select
            value={priorityLevel}
            onChange={(e) => onPriorityChange(e.target.value as PriorityLevel)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none"
          >
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={overtimeAllowed}
            onChange={(e) => onOvertimeChange(e.target.checked)}
            className="h-4 w-4"
          />
          Allow overtime candidates
        </label>

        <label className="flex items-center gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => onAvailableOnlyChange(e.target.checked)}
            className="h-4 w-4"
          />
          Only show currently available candidates
        </label>
      </div>
    </section>
  );
}