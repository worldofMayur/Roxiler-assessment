import React, { createContext, useContext, useState, useMemo } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Hydrate from localStorage synchronously (no flicker, no “logged-out-then-in”)
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem('authUser');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem('authToken') || null;
    } catch {
      return null;
    }
  });

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);

    try {
      window.localStorage.setItem('authUser', JSON.stringify(userData));
      window.localStorage.setItem('authToken', jwtToken);
    } catch {
      // ignore storage errors (private mode etc.)
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    try {
      window.localStorage.removeItem('authUser');
      window.localStorage.removeItem('authToken');
    } catch {
      // ignore
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
