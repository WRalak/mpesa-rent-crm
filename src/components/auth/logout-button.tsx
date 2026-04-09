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
      // Clear session first
      await signOut({ redirect: false });
      
      // Clear any remaining session data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('next-auth.session-token');
        sessionStorage.removeItem('next-auth.session-token');
      }
      
      // Redirect to home
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      
      // Fallback: clear all auth data and redirect
      if (typeof window !== 'undefined') {
        // Clear all possible storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear cookies
        document.cookie.split(";").forEach((c) => {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        
        // Force redirect
        window.location.href = "/";
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">
        {session.user?.role === 'ADMIN' ? 'Admin' : (session.user?.name || session.user?.phone)}
      </span>
      <Button onClick={handleLogout} variant="outline" size="sm">
        Logout
      </Button>
    </div>
  );
}
