import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { db } from "@/lib/db";

const loginSchema = z.object({
  phone: z.string().min(10),
});

export const authConfig = {
  providers: [
    Credentials({
      name: "Phone",
      credentials: {
        phone: { label: "Phone", type: "text" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const phone = parsed.data.phone.replace(/\D/g, "");
        const user = await db.user.findUnique({
          where: { phone },
        });

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          name: user.name ?? "",
          email: user.email ?? "",
          phone: user.phone,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/login",
  },
};
