import { useCallback, useEffect, useState } from "react";
import { Seo } from "@/components/Seo";
import { Field } from "@/components/primitives/Field";
import { fetchProfilesByRole, updateProfileRole } from "@/lib/data/profiles";
import type { Profile, Role } from "@/lib/auth/auth";

export default function ArtistsPage() {
  const [people, setPeople] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [artists, admins] = await Promise.all([
      fetchProfilesByRole("artist"),
      fetchProfilesByRole("admin"),
    ]);
    setPeople([...admins, ...artists]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load().catch(() => setLoading(false));
  }, [load]);

  const changeRole = async (id: string, role: Role) => {
    const result = await updateProfileRole(id, role);
    setMessage(result.ok ? "Role updated." : result.error ?? "Could not update the role.");
    if (result.ok) await load();
  };

  return (
    <>
      <Seo title="Artists" description="Studio accounts and roles." path="/dashboard/artists" />
      <header className="dash__head">
        <h1>Artists &amp; accounts</h1>
        <p className="muted">
          Everyone with studio access. Brides who sign in with a magic link are added automatically as
          brides.
        </p>
      </header>

      {message ? <p className="dash__notice">{message}</p> : null}

      <section className="dash__panel">
        {loading ? (
          <p className="muted">Loading…</p>
        ) : people.length === 0 ? (
          <p className="muted">
            No studio accounts yet. When an artist signs in once, promote them here.
          </p>
        ) : (
          <ul className="dash__list">
            {people.map((person) => (
              <li key={person.id} className="dash__list-row">
                <span>
                  <span className="dash__list-name">{person.full_name ?? "Unnamed"}</span>
                  <span className="dash__list-meta">{person.email ?? person.id}</span>
                </span>
                <span className="dash__role-picker">
                  <Field label="Role" htmlFor={`role-${person.id}`}>
                    <select
                      id={`role-${person.id}`}
                      value={person.role}
                      onChange={(e) => void changeRole(person.id, e.target.value as Role)}
                    >
                      <option value="artist">Artist</option>
                      <option value="admin">Owner (admin)</option>
                    </select>
                  </Field>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}