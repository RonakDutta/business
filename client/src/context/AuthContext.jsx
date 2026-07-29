import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth as authApi, getToken } from "../api";

const KEY = "b4:user";
const AuthContext = createContext(null);

const hasApi = Boolean(import.meta.env.VITE_API_URL);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Restore a session on load.
  useEffect(() => {
    let active = true;

    (async () => {
      if (hasApi) {
        // Real mode: a stored token means we can ask who we are.
        if (getToken()) {
          const current = await authApi.me(); // null if the token's dead
          if (active && current) setUser(current);
        }
      } else {
        // Stub mode: trust whatever's in localStorage.
        try {
          const raw = localStorage.getItem(KEY);
          if (raw) setUser(JSON.parse(raw));
        } catch {
          /* storage unavailable or corrupt */
        }
      }
      if (active) setReady(true);
    })();

    return () => {
      active = false;
    };
  }, []);

  // Stub-mode persistence. In API mode the token (not b4:user) is the session.
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
    Admin check. Real users carry a server-assigned `role`; the stub keeps its
    old rule (any admin@… address) so admin screens stay reachable offline.
    Client-side gating only — the server enforces the real thing.
  */
  const isAdmin = user?.role
    ? user.role === "admin"
    : Boolean(user?.email?.toLowerCase().startsWith("admin@"));

  const signIn = useCallback(
    async (email, password) => {
      if (hasApi) {
        const current = await authApi.login({ email, password });
        setUser(current);
        return current;
      }
      const next = { email, name: email.split("@")[0] };
      persist(next);
      return next;
    },
    [persist],
  );

  const signUp = useCallback(
    async (name, email, password) => {
      if (hasApi) {
        const current = await authApi.register({ name, email, password });
        setUser(current);
        return current;
      }
      const next = { email, name: name || email.split("@")[0] };
      persist(next);
      return next;
    },
    [persist],
  );

  const signOut = useCallback(() => {
    if (hasApi) authApi.logout(); // clears the token
    persist(null); // clears state + any stub copy
  }, [persist]);

  return (
    <AuthContext.Provider
      value={{ user, ready, isAdmin, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
