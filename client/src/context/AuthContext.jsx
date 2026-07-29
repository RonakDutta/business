import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api";
import { getToken } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // On page load, if we still have a token, ask the server who it belongs to.
  useEffect(() => {
    async function loadUser() {
      if (getToken()) {
        try {
          const currentUser = await authApi.getCurrentUser();
          setUser(currentUser);
        } catch {
          setUser(null);
        }
      }
      setReady(true);
    }

    loadUser();
  }, []);

  async function signIn(email, password) {
    const loggedInUser = await authApi.login(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function signUp(name, email, password) {
    const newUser = await authApi.register(name, email, password);
    setUser(newUser);
    return newUser;
  }

  function signOut() {
    authApi.logout();
    setUser(null);
  }

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, ready, isAdmin, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
