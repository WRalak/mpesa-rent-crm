"use client";

import { createContext, useContext } from "react";
import { useSession } from "next-auth/react";

type AuthContextValue = {
  isAuthenticated: boolean;
  user: { id?: string; role?: string; phone?: string } | null;
};

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  user: null,
});

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const { data } = useSession();
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(data?.user),
        user: data?.user ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
