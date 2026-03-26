import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
            Vocantas Shift Fill Decision Copilot
          </span>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            AI ranking for open-shift recovery.
          </h1>

          <p className="text-lg text-slate-300">
            This MVP recommends the best outreach sequence for an open shift by
            applying hard eligibility rules, candidate scoring, fill-likelihood
            prediction, and manager-readable explanations.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Step 1</p>
            <h2 className="mt-2 text-lg font-semibold">Rule filtering</h2>
            <p className="mt-2 text-sm text-slate-300">
              Remove candidates who fail role, certification, unit, facility,
              availability, rest, or fatigue constraints.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Step 2</p>
            <h2 className="mt-2 text-lg font-semibold">Fit scoring</h2>
            <p className="mt-2 text-sm text-slate-300">
              Score candidates using acceptance history, response speed,
              attendance reliability, seniority, fairness, overtime, and fatigue.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Step 3</p>
            <h2 className="mt-2 text-lg font-semibold">Recommendation</h2>
            <p className="mt-2 text-sm text-slate-300">
              Recommend the top outreach order, best channel, and overall shift
              fill probability.
            </p>
          </div>
        </div>

        <div>
          <Link
            href="/simulator"
            className="inline-flex rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Open simulator
          </Link>
        </div>
      </div>
    </main>
  );
}