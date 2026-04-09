"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <Button disabled>Loading...</Button>;
  }

  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback redirect
      window.location.href = "/";
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">
        {session.user?.name || session.user?.phone}
      </span>
      <Button onClick={handleLogout} variant="outline" size="sm">
        Logout
      </Button>
    </div>
  );
}
