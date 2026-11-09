import { createContext, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const data = response.data;

    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);

    return data;
  };

  const register = async (name, email, password) => {
    const response = await api.post("/auth/register", { name, email, password });
    const data = response.data;

    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
