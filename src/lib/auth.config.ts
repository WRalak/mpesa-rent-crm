import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { db } from "@/lib/db";
import { SecurityUtils } from "@/lib/security";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

const loginSchema = z.object({
  phone: z.string()
    .min(5, "Phone number must be at least 5 digits")
    .max(20, "Phone number must not exceed 20 digits")
    .refine((phone) => SecurityUtils.validatePhoneNumber(phone), {
      message: "Invalid phone number format",
    }),
  otp: z.string().optional().refine((otp) => !otp || otp.length === 6, {
    message: "OTP must be exactly 6 digits",
  }),
});

export const authConfig = {
  providers: [
    Credentials({
      name: "Phone",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        try {
          const parsed = loginSchema.safeParse(credentials);
          if (!parsed.success) {
            return null;
          }

          const { phone } = parsed.data;
          const user = await db.user.findUnique({
            where: { phone },
            select: { id: true, name: true, phone: true, role: true, email: true },
          });

          if (!user) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            phone: user.phone,
            role: user.role,
            email: user.email,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: "lax" as const,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    pkceCodeVerifier: {
      name: `next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: "/login",
    error: "/login?error=true",
  },
  callbacks: {
    async signIn({ user, account }: { user?: any; account?: any }) {
      // Additional sign-in validation
      if (!user?.phone) {
        return false;
      }
      
      try {
        // Check if user is still active/valid
        const dbUser = await db.user.findUnique({
          where: { phone: user.phone },
        });
        
        return !!dbUser;
      } catch {
        return false;
      }
    },
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "LANDLORD";
        token.phone = (user as { phone?: string }).phone;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as string) ?? "LANDLORD";
        session.user.phone = (token.phone as string) ?? "";
      }
      return session;
    },
  },
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === "production",
};
