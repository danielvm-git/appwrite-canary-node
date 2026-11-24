import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";
import { appwriteConfigured } from "../lib/appwrite";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { loading, user } = useSession();

  if (loading) return null;
  if (appwriteConfigured() && !user) return <Navigate to="/" replace />;
  return <>{children}</>;
}