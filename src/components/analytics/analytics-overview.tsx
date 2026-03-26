type ScenarioRunView = {
  id: string;
  shiftTitle: string;
  predictedFillProbability: number;
  recommendedSequence: string[];
  managerOverrideCandidateId: string | null;
  managerOverrideReason: string | null;
  finalOutcome: string | null;
  createdAt: string;
};

type Props = {
  runs: ScenarioRunView[];
};

function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-100">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{helper}</p>
    </div>
  );
}

export function AnalyticsOverview({ runs }: Props) {
  const totalRuns = runs.length;
  const avgFillProbability =
    totalRuns === 0
      ? 0
      : Math.round(
          runs.reduce((sum, run) => sum + run.predictedFillProbability, 0) / totalRuns,
        );

  const overrideCount = runs.filter((run) => Boolean(run.managerOverrideCandidateId)).length;
  const overrideRate = totalRuns === 0 ? 0 : Math.round((overrideCount / totalRuns) * 100);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
      <h2 className="text-2xl font-semibold text-slate-100">Analytics snapshot</h2>
      <p className="mt-2 text-sm text-slate-400">
        Quick read on saved simulator runs and manager behavior.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard
          label="Saved runs"
          value={String(totalRuns)}
          helper="Number of stored decision scenarios"
        />
        <StatCard
          label="Average fill probability"
          value={`${avgFillProbability}%`}
          helper="Average predicted fill confidence"
        />
        <StatCard
          label="Override rate"
          value={`${overrideRate}%`}
          helper="How often managers overrode AI ordering"
        />
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-slate-100">Recent runs</h3>

        <div className="mt-4 space-y-3">
          {runs.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">
              No saved runs yet.
            </div>
          ) : (
            runs.map((run) => (
              <div
                key={run.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-4"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium text-slate-100">{run.shiftTitle}</p>
                    <p className="text-sm text-slate-400">
                      {new Date(run.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-sm text-slate-300">
                    Fill probability:{" "}
                    <span className="font-semibold text-emerald-300">
                      {run.predictedFillProbability}%
                    </span>
                  </div>
                </div>

                <div className="mt-3 h-2 w-full rounded-full bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-emerald-400"
                    style={{ width: `${run.predictedFillProbability}%` }}
                  />
                </div>

                <p className="mt-3 text-sm text-slate-300">
                  Sequence: {run.recommendedSequence.join(" → ")}
                </p>

                {run.managerOverrideReason ? (
                  <p className="mt-2 text-sm text-amber-300">
                    Override reason: {run.managerOverrideReason}
                  </p>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}