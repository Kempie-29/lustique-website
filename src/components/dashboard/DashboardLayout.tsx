import { NavLink, Outlet } from "react-router-dom";
import { Logo } from "@/components/shell/Logo";
import { useAuth } from "@/lib/auth/auth";

interface RailLink {
  to: string;
  label: string;
  end?: boolean;
}

const SHARED_LINKS: RailLink[] = [
  { to: "/dashboard/requests", label: "Requests & bookings" },
  { to: "/dashboard/messages", label: "Messages" },
  { to: "/dashboard/availability", label: "Calendar" },
];

/** Left-rail shell shared by the owner control panel and the artist workspace. */
export function DashboardLayout() {
  const { profile, isAdmin, signOut } = useAuth();

  const links: RailLink[] = [
    { to: "/dashboard", label: "Overview", end: true },
    ...SHARED_LINKS,
    ...(isAdmin ? [{ to: "/dashboard/artists", label: "Artists" }] : []),
  ];

  return (
    <div className="dash">
      <aside className="dash__rail">
        <NavLink to="/" className="dash__brand" aria-label="Lustique Co. — home">
          <Logo variant="full" onDark className="dash__logo" alt="" />
        </NavLink>

        <p className="dash__role">{isAdmin ? "Owner control panel" : "Artist workspace"}</p>

        <nav className="dash__nav" aria-label="Dashboard">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `dash__link ${isActive ? "is-active" : ""}`.trim()}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="dash__foot">
          <p className="dash__user">{profile?.full_name ?? profile?.email ?? "Signed in"}</p>
          <NavLink to="/portal" className="dash__link">
            My portal
          </NavLink>
          <button type="button" className="dash__link dash__link--button" onClick={() => void signOut()}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="dash__main" id="main">
        <Outlet />
      </main>
    </div>
  );
}