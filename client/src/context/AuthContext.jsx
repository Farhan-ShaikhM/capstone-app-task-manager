import { useState } from "react";
import api from "../api/axios";
import { AuthContext } from "./AuthContextValue";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    return null;
  });
  const loading = false;

  // Login function
  const login = async (email, password) => {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    setUser(res.data.user);

    return res.data;
  };

  // Register function
  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    setUser(res.data.user);

    return res.data;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

