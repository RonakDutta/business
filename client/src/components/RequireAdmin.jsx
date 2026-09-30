import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/** Route guard for /admin. Client-side only, see the note in AuthContext. */
export default function RequireAdmin({ children }) {
  const { user, isAdmin, ready } = useAuth();
  const { pathname } = useLocation();

  if (!ready) return null; // don't flash the login page while storage loads

  if (!user) {
    return (
      <Navigate to={`/login?next=${encodeURIComponent(pathname)}`} replace />
    );
  }

  if (!isAdmin) {
    return (
      <section className="mx-auto max-w-[440px] px-6 py-24 text-center">
        <h1 className="display-page">Organisers only</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          You're signed in as {user.email}, which doesn't have access to the
          organiser console.
        </p>
        <p className="mt-6 rounded-card border border-line bg-surface p-4 text-[14px] leading-relaxed text-subtle">
          If you're on the organising team and this is the wrong account, log
          out and sign back in with the one we set up for you.
        </p>
        <Link to="/" className="btn btn-primary mt-8">
          Back home
        </Link>
      </section>
    );
  }

  return children;
}
