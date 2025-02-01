import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "@/utils/axiosInstance.js";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const getUserData = async () => {
    try {
      const { data } = await axiosInstance.get("/users/me");
      setUser(data);
    } catch (error) {
      console.error("Error fetch user data:", error);
    }
  }

  const login = async (userData) => {
    try {
      const { data } = await axiosInstance.post("/login", userData);
      const token = data?.token;

      if(token) {
        setToken(token);
        localStorage.setItem('token', token);
      }
    } catch (error) {
      throw error;
    }
  }

  const register = async (userData) => {
    try {
      const { data } = await axiosInstance.post("/users", userData);
      const token = data?.token;

      if(token) {
        setToken(token);
        localStorage.setItem('token', token);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const hasPermission = (roles) => {
    return Array.isArray(roles) ? roles.includes(user?.role) : user?.role === roles;
  };

  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      getUserData();
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"];
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);