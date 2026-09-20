import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { homeForRole, useAuth, type Role } from "@/lib/auth/auth";

function AuthPending() {
  return (
    <section className="section">
      <div className="wrap--narrow">
        <p className="muted">Checking your account…</p>
      </div>
    </section>
  );
}

/** Requires a signed-in user; sends everyone else to sign-in. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthPending />;
  if (!user) return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  return <>{children}</>;
}

/** Requires a signed-in user holding one of `roles`. */
export function RequireRole({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthPending />;
  if (!user) return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  if (!role) return <AuthPending />;
  if (!roles.includes(role)) return <Navigate to={homeForRole(role)} replace />;
  return <>{children}</>;
}