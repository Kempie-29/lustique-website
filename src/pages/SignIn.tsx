import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Logo } from "@/components/shell/Logo";
import { Button } from "@/components/primitives/Button";
import { Field } from "@/components/primitives/Field";
import { supabase } from "@/lib/supabase";
import { homeForRole, useAuth } from "@/lib/auth/auth";

type Mode = "magic" | "password";

export default function SignIn() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  const [mode, setMode] = useState<Mode>("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user && role) {
      navigate(from ?? homeForRole(role), { replace: true });
    }
  }, [loading, user, role, from, navigate]);

  const handleMagicLink = async () => {
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/signin` },
    });
    setBusy(false);
    if (err) setError(err.message);
    else setNotice("Check your inbox — we've sent you a secure sign-in link.");
  };

  const handlePassword = async () => {
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (err) setError(err.message);
  };

  return (
    <>
      <Seo title="Sign in" description="Sign in to your Lustique Co. portal." path="/signin" />
      <section className="section auth-shell">
        <div className="wrap--narrow auth-panel">
          <div className="auth-panel__brand">
            <Logo variant="full" alt="Lustique Co." />
          </div>
          <h1 className="auth-panel__title">Your Lustique portal</h1>
          <p className="muted">
            Sign in to track your booking, sign your contract and message your artist.
          </p>

          <form
            className="auth-form"
            onSubmit={(e) => {
              e.preventDefault();
              void (mode === "magic" ? handleMagicLink() : handlePassword());
            }}
          >
            <Field label="Email" htmlFor="email" required>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>

            {mode === "password" ? (
              <Field label="Password" htmlFor="password" required>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
            ) : null}

            {notice ? <p className="auth-note auth-note--ok">{notice}</p> : null}
            {error ? <p className="auth-note auth-note--error">{error}</p> : null}

            <Button type="submit" variant="primary" block disabled={busy}>
              {busy ? "One moment…" : mode === "magic" ? "Email me a sign-in link" : "Sign in"}
            </Button>
          </form>

          <button
            type="button"
            className="auth-toggle"
            onClick={() => {
              setMode(mode === "magic" ? "password" : "magic");
              setError(null);
              setNotice(null);
            }}
          >
            {mode === "magic" ? "Sign in with a password instead" : "Email me a sign-in link instead"}
          </button>

          <p className="muted auth-foot">
            New here? Build your estimate and we'll set up your portal.{" "}
            <Link to="/quote">Start an estimate</Link>.
          </p>
        </div>
      </section>
    </>
  );
}