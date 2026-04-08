import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default function RegisterPage() {
  async function register(formData: FormData) {
    "use server";
    const name = String(formData.get("name") ?? "");
    const phone = String(formData.get("phone") ?? "").replace(/\D/g, "");
    const email = String(formData.get("email") ?? "");

    if (!name || !phone) {
      return;
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

    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-semibold">Register</h1>
      <p className="text-sm text-gray-600 mt-1">Create your landlord account.</p>

      <form action={register} className="mt-6 space-y-3">
        <input name="name" placeholder="Full name" className="w-full rounded-md border px-3 py-2" required />
        <input name="phone" placeholder="2547XXXXXXXX" className="w-full rounded-md border px-3 py-2" required />
        <input name="email" type="email" placeholder="Email (optional)" className="w-full rounded-md border px-3 py-2" />
        <button className="w-full rounded-md bg-black text-white px-3 py-2">Create Account</button>
      </form>
    </main>
  );
}
