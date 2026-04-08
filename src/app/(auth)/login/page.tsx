import { signIn } from "@/lib/auth";

export default function LoginPage() {
  async function login(formData: FormData) {
    "use server";

    const phone = String(formData.get("phone") ?? "");
    await signIn("credentials", {
      phone,
      redirectTo: "/dashboard",
    });
  }

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="text-sm text-gray-600 mt-1">Sign in with your phone number.</p>

      <form action={login} className="mt-6 space-y-3">
        <input
          name="phone"
          placeholder="2547XXXXXXXX"
          className="w-full rounded-md border px-3 py-2"
          required
        />
        <button className="w-full rounded-md bg-black text-white px-3 py-2">
          Continue
        </button>
      </form>
      <p className="mt-3 text-sm">
        New landlord? <a className="underline" href="/register">Create account</a>
      </p>
    </main>
  );
}
