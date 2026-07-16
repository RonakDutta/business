import { createContext, useCallback, useContext, useEffect, useState } from "react";

const KEY = "b4:user";
const AuthContext = createContext(null);

/* ===========================================================================
   ⚠️  STUB — THIS IS NOT AUTHENTICATION.

   There is no server, no password check, no session. It writes a name into
   localStorage and trusts it. Anyone can open devtools and "sign in" as
   anybody, so do not put anything private behind it and do not ship it.

   It exists so the RSVP flow and the navbar can be built and reviewed now.
   When the real backend lands, replace the three functions below — signIn,
   signUp, signOut — and every component keeps working as-is.
   =========================================================================== */

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* storage unavailable or corrupt */
    }
    setReady(true);
  }, []);

  const persist = useCallback((next) => {
    setUser(next);
    try {
      if (next) localStorage.setItem(KEY, JSON.stringify(next));
      else localStorage.removeItem(KEY);
    } catch {
      /* storage unavailable */
    }
  }, []);

  /*
    STUB RULE: any address starting with "admin@" is an admin.
    Sign in as admin@business4.com to reach /admin. Replace this with a real
    role from the server — never trust a client-side check in production.
  */
  const isAdmin = Boolean(user?.email?.toLowerCase().startsWith("admin@"));

  const signIn = useCallback(
    (email) => {
      const next = { email, name: email.split("@")[0] };
      persist(next);
      return next;
    },
    [persist]
  );

  const signUp = useCallback(
    (name, email) => {
      const next = { email, name: name || email.split("@")[0] };
      persist(next);
      return next;
    },
    [persist]
  );

  const signOut = useCallback(() => persist(null), [persist]);

  return (
    <AuthContext.Provider value={{ user, ready, isAdmin, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
