import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./auth";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.init(); // restores persisted session on refresh
    setUser(auth.user);
    setLoading(false);
  }, []);

  const value = {
    user,
    async login(email, password) {
      await auth.login(email, password);
      setUser(auth.user);
    },
    async signup(email, password, role) {
      await auth.signup(email, password, role);
      setUser(auth.user);
    },
    logout() {
      auth.logout();
      setUser(null);
    },
  };

  return loading ? null : (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}