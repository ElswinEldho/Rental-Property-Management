export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 border border-sky-100">
          Phase 1 Foundation Operational
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Rental Property Management System
        </h1>
        <p className="mt-4 text-base text-slate-600 leading-relaxed">
          Modular Monolith &amp; Feature-Based Architecture established. Both Next.js 16 frontend and Express.js backend are initialized and ready for feature implementation upon approval.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 text-left">
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
            <h2 className="text-sm font-semibold text-slate-900">Admin / Owner Portal</h2>
            <p className="mt-1 text-xs text-slate-500">
              Manage properties, lease contracts, utility tariffs, billing runs, and verify tenant UPI payments.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
            <h2 className="text-sm font-semibold text-slate-900">Tenant Portal</h2>
            <p className="mt-1 text-xs text-slate-500">
              Self-service tenancy inspection, power consumption logs, itemized bills, and direct UPI payment submission.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Backend API: /api/v1/health</span>
          <span>Next.js 16 App Router (ES Modules)</span>
        </div>
      </div>
    </main>
  );
}

