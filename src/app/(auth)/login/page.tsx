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
  const userNotFound = params.error === "user_not_found";

  async function login(formData: FormData) {
    "use server";

    const phone = String(formData.get("phone") ?? "").replace(/\D/g, "");
    if (!phone) {
      redirect("/login?error=invalid_credentials");
    }

    // Check if user exists and get role
    try {
      const { db } = await import("@/lib/db");
      const user = await db.user.findUnique({
        where: { phone },
        select: { role: true }
      });

      if (!user) {
        redirect("/login?error=user_not_found");
      }

      // Determine redirect based on role
      const redirectTo = user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";

      await signIn("credentials", {
        phone,
        redirectTo,
      });
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof AuthError) {
        redirect("/login?error=invalid_credentials");
      }
      redirect("/login?error=invalid_credentials");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center p-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Welcome Back</h1>
      <p className="text-sm text-slate-600 mt-1">Enter your phone number to sign in.</p>
      {hasError ? (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Sign in failed. Please check your phone number and try again.
        </p>
      ) : userNotFound ? (
        <p className="mt-3 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700">
          Phone number not found. Use a test user above or create an account.
        </p>
      ) : null}

      <form action={login} className="mt-6 space-y-3">
        <input
          name="phone"
          type="tel"
          inputMode="numeric"
          placeholder="2547XXXXXXXX"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          required
        />
        <button className="w-full rounded-lg bg-slate-900 text-white px-3 py-2 hover:bg-slate-800">
          Sign In
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        New landlord?{" "}
        <Link className="font-medium text-slate-900 underline" href="/register">
          Create account
        </Link>
      </p>
      
      {/* Test Users Section */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Quick Demo - Test Users</h3>
        <div className="space-y-1 text-xs text-blue-700">
          <p><strong>Admin:</strong> 254700000000</p>
          <p><strong>Landlord 1:</strong> 254700000001 (John)</p>
          <p><strong>Landlord 2:</strong> 254700000002 (Jane)</p>
          <p><strong>Landlord 3:</strong> 254700000003 (Bob)</p>
          <p><strong>Landlord 4:</strong> 254700000004 (Alice)</p>
          <p><strong>Landlord 5:</strong> 254700000005 (Test)</p>
        </div>
        <p className="mt-2 text-xs text-blue-600 font-medium">No password needed - just phone number!</p>
      </div>
      </section>
    </main>
  );
}
