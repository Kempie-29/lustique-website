import { lux } from "@/lib/supabase";
import type { Profile, Role } from "@/lib/auth/auth";

/** Admin-only by RLS: lists every profile with the given role. */
export async function fetchProfilesByRole(role: Role): Promise<Profile[]> {
  const { data, error } = await lux()
    .from("profiles")
    .select("*")
    .eq("role", role)
    .order("full_name", { ascending: true });
  if (error) throw error;
  return (data as Profile[]) ?? [];
}

export async function updateProfileRole(id: string, role: Role): Promise<{ ok: boolean; error?: string }> {
  const { error } = await lux().from("profiles").update({ role }).eq("id", id);
  return error ? { ok: false, error: error.message } : { ok: true };
}