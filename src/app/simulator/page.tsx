import { rankCandidates } from "@/features/ranking/ranking.service";
import { demoCandidates, demoShift } from "@/lib/demo-data";

export default function SimulatorPage() {
  const result = rankCandidates(demoShift, demoCandidates);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12">
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
              Live demo scenario
            </span>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
              {result.shift.facility}
            </span>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
              {result.shift.unit}
            </span>
          </div>

          <h1 className="text-3xl font-bold">{result.shift.title}</h1>

          <p className="text-slate-300">
            {result.shift.role} • {result.shift.startTime.toLocaleString()} →{" "}
            {result.shift.endTime.toLocaleString()}
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Predicted fill probability</p>
              <p className="mt-2 text-3xl font-bold text-emerald-300">
                {result.predictedFillProbability}%
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Required certifications</p>
              <p className="mt-2 text-lg font-semibold">
                {result.shift.requiredCertifications.join(", ")}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Recommended sequence</p>
              <p className="mt-2 text-lg font-semibold">
                {result.recommendedSequence.map((item) => item.candidate.name).join(" → ")}
              </p>
            </div>
          </div>
        </div>

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
                  <tr
                    key={ranked.candidate.id}
                    className="rounded-xl border border-slate-800 bg-slate-950"
                  >
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