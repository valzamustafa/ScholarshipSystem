import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import Spinner from "react-bootstrap/Spinner";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
          const normalizedRole = parsedUser.role?.toLowerCase();

          setUser({
            ...parsedUser,
            role: normalizedRole,
            approved: parsedUser.approved !== false,
            token: storedToken
          });
        } catch (err) {
          console.error("Error parsing user data:", err);
          await logout();
          setLoading(false);
          return;
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

 const login = (userData, token, refreshToken) => {
  const normalizedUser = {
    ...userData,
    role: (userData.role || '').toLowerCase(),
    approved: Boolean(userData.approved),
    token
  };
  localStorage.setItem("user", JSON.stringify(normalizedUser));
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
  setUser(normalizedUser);
};

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await fetch('https://localhost:7255/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("studentId");
      localStorage.removeItem("role");

      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {loading ? <Spinner animation="border" variant="primary" /> : children}
    </AuthContext.Provider>
  );
};
