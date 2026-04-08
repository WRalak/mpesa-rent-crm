import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";

export default function RegisterPage() {
  async function register(formData: FormData) {
    "use server";
    const name = String(formData.get("name") ?? "");
    const phone = String(formData.get("phone") ?? "").replace(/\D/g, "");
    const email = String(formData.get("email") ?? "");

    if (!name || phone.length < 10) {
      redirect("/register");
    }

    await db.user.upsert({
      where: { phone },
      update: { name, email: email || null },
      create: {
        name,
        email: email || null,
        phone,
        role: "LANDLORD",
      },
    });

    redirect(`/verify-phone?phone=${encodeURIComponent(phone)}`);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center p-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Create Account</h1>
      <p className="text-sm text-slate-600 mt-1">Set up your landlord account in seconds.</p>

      <form action={register} className="mt-6 space-y-3">
        <input name="name" placeholder="Full name" className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
        <input
          name="phone"
          type="tel"
          inputMode="numeric"
          placeholder="2547XXXXXXXX"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          required
        />
        <input name="email" type="email" placeholder="Email (optional)" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        <button className="w-full rounded-lg bg-slate-900 px-3 py-2 text-white hover:bg-slate-800">Create Account</button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Already have an account?{" "}
        <Link className="font-medium text-slate-900 underline" href="/login">
          Login
        </Link>
      </p>
      </section>
    </main>
  );
}
