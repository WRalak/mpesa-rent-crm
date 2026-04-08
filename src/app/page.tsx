import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center p-8">
      <section className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
        <p className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
          M-Pesa + Landlord CRM
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Modern rent collection and compliance in one dashboard
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600">
          Collect rent, monitor defaulters, run M-Pesa STK pushes, and generate monthly eRITS tax
          summaries without spreadsheets.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/login" className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800">
            Login
          </Link>
          <Link href="/register" className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Create Account
          </Link>
          <Link href="/dashboard" className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            View Demo Dashboard
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">Instant M-Pesa payment requests</div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">Tenant and property tracking</div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">Monthly eRITS tax report support</div>
        </div>
      </section>
    </main>
  );
}
