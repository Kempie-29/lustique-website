import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { lux, supabase } from "@/lib/supabase";

export type Role = "admin" | "artist" | "bride";

export interface Profile {
  id: string;
  role: Role;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  artist_id: string | null;
}

interface AuthValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: Role | null;
  isAdmin: boolean;
  isArtist: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | undefined>(undefined);

async function loadProfile(userId: string): Promise<Profile | null> {
  const { data } = await lux().from("profiles").select("*").eq("id", userId).maybeSingle();
  return (data as Profile) ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const apply = async (next: Session | null) => {
      if (!active) return;
      setSession(next);
      if (next?.user) {
        const p = await loadProfile(next.user.id);
        if (active) setProfile(p);
      } else {
        setProfile(null);
      }
    };

    supabase.auth.getSession().then(async ({ data }) => {
      await apply(data.session);
      if (active) setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      // Defer: Supabase warns against calling other client methods synchronously
      // inside this callback.
      setTimeout(() => void apply(next), 0);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthValue>(() => {
    const role = profile?.role ?? null;
    return {
      user: session?.user ?? null,
      session,
      profile,
      role,
      isAdmin: role === "admin",
      isArtist: role === "artist",
      loading,
      signOut: async () => {
        await supabase.auth.signOut();
      },
      refreshProfile: async () => {
        if (session?.user) setProfile(await loadProfile(session.user.id));
      },
    };
  }, [session, profile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/** The home route for a given role. */
export function homeForRole(role: Role | null): string {
  return role === "admin" || role === "artist" ? "/dashboard" : "/portal";
}