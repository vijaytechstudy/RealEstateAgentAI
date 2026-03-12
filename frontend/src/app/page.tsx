export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-16 px-6 py-16 lg:flex-row lg:py-24">
        <div className="space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur">
            AI SaaS for real estate agents
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Create listings, social content
            <span className="block text-sky-400">and manage leads with AI.</span>
          </h1>
          <p className="max-w-xl text-sm text-slate-300 sm:text-base">
            Generate high-converting property listings, social media campaigns, and track every
            lead in a simple CRM—so you can focus on closing deals, not writing copy.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-sky-500/30 transition hover:bg-sky-400"
            >
              Login
            </a>
            <a
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900/50 px-5 py-2.5 text-sm font-medium text-slate-100 hover:border-slate-500"
            >
              Start free (3 listings / month)
            </a>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-slate-400">
            <span>✓ AI listing generator</span>
            <span>✓ Social posts for Instagram, Facebook, LinkedIn</span>
            <span>✓ Lead CRM</span>
          </div>
        </div>
        <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Live overview</span>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
              For demo only
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
              <div className="text-slate-400">Listings</div>
              <div className="mt-2 text-xl font-semibold text-slate-50">24</div>
              <div className="mt-1 text-[10px] text-emerald-400">+6 this week</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
              <div className="text-slate-400">Leads</div>
              <div className="mt-2 text-xl font-semibold text-slate-50">85</div>
              <div className="mt-1 text-[10px] text-sky-400">12 scheduled visits</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
              <div className="text-slate-400">Win rate</div>
              <div className="mt-2 text-xl font-semibold text-slate-50">31%</div>
              <div className="mt-1 text-[10px] text-amber-300">↑ with AI copy</div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-xs">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-medium text-slate-200">Next action</span>
              <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] text-sky-300">
                Recommended
              </span>
            </div>
            <p className="text-slate-300">
              “3 new buyer leads are still in <span className="font-semibold">Contacted</span>.
              Schedule visits this week to move them to <span className="font-semibold">Closed</span>.”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
