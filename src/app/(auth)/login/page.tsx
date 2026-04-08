import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const hasError = params.error === "invalid_credentials";

  async function login(formData: FormData) {
    "use server";

    const phone = String(formData.get("phone") ?? "").replace(/\D/g, "");
    if (!phone) {
      redirect("/login?error=invalid_credentials");
    }

    try {
      await signIn("credentials", {
        phone,
        redirectTo: "/dashboard",
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect("/login?error=invalid_credentials");
      }
      throw error;
    }
  }

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="text-sm text-gray-600 mt-1">Sign in with your phone number.</p>
      {hasError ? (
        <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Login failed. Check your phone number and try again.
        </p>
      ) : null}

      <form action={login} className="mt-6 space-y-3">
        <input
          name="phone"
          type="tel"
          inputMode="numeric"
          placeholder="2547XXXXXXXX"
          className="w-full rounded-md border px-3 py-2"
          required
        />
        <button className="w-full rounded-md bg-black text-white px-3 py-2">
          Continue
        </button>
      </form>
      <p className="mt-3 text-sm">
        New landlord?{" "}
        <Link className="underline" href="/register">
          Create account
        </Link>
      </p>
    </main>
  );
}
