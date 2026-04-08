export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold">M-Pesa Rent CRM</h1>
      <p className="mt-2 text-gray-600">
        Collect rent, monitor defaulters, and generate monthly eRITS reports in one place.
      </p>

      <div className="mt-6 flex gap-3">
        <a href="/login" className="rounded-md bg-black text-white px-4 py-2">
          Login
        </a>
        <a href="/register" className="rounded-md border px-4 py-2">
          Register
        </a>
      </div>
    </main>
  );
}
