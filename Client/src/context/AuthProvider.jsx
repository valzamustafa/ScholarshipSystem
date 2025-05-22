import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          ...parsedUser,
          role: parsedUser.role?.toLowerCase(),
          approved: Boolean(parsedUser.approved),
        });
      } catch (err) {
        console.error("Error parsing user data:", err);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

const updateUser = (userData) => {
  const normalizedUser = {
    ...userData,
    role: userData.role?.toLowerCase(), 
    approved: Boolean(userData.approved) 
  };
  localStorage.setItem("user", JSON.stringify(normalizedUser));
  setUser(normalizedUser);
};

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser: updateUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};