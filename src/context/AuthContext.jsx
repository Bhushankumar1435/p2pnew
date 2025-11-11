import { createContext, useContext, useState  } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("auth_token"));
    const isAuthenticated = !!token;

    const login = (token) => {
        localStorage.setItem("auth_token", token);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem("auth_token");
        setToken(null);
    };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext); 
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};