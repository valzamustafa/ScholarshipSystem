import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          ...parsedUser,
          role: parsedUser.role?.toLowerCase(),
          approved: Boolean(parsedUser.approved),
          token: storedToken
        });
      } catch (err) {
        console.error("Error parsing user data:", err);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    const normalizedUser = {
      ...userData,
      role: userData.role?.toLowerCase(),
      approved: Boolean(userData.approved),
      token
    };
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("token", token);
    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        loading, 
        login,
        logout 
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};