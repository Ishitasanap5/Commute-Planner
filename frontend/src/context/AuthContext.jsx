// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  registerUser,
  getCurrentUser,
} from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Check if user already logged in (on refresh)
  const checkAuth = async () => {
    try {
      const data = await getCurrentUser();
      setUser(data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // 🔐 Login
  const login = async (formData) => {
    const data = await loginUser(formData);

    // assuming backend returns { token, user }
    localStorage.setItem("token", data.token);
    setUser(data.user);

    return data;
  };

  // 📝 Register
  const register = async (formData) => {
    const data = await registerUser(formData);

    localStorage.setItem("token", data.token);
    setUser(data.user);

    return data;
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
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
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook (clean usage)
export const useAuth = () => useContext(AuthContext);