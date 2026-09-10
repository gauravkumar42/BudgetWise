import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loginUser, getMe, updateMe as updateMeApi } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    const token = localStorage.getItem("budgetwise_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await getMe();
      setUser(data.user);
    } catch (err) {
      localStorage.removeItem("budgetwise_token");
      localStorage.removeItem("budgetwise_user");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = async ({ email, name }) => {
    const { data } = await loginUser({ email, name });
    localStorage.setItem("budgetwise_token", data.token);
    localStorage.setItem("budgetwise_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("budgetwise_token");
    localStorage.removeItem("budgetwise_user");
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const { data } = await updateMeApi(payload);
    setUser(data.user);
    return data.user;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateProfile, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
