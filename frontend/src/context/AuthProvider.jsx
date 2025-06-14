import React, { createContext, useState, useContext } from 'react';

// Create the AuthContext with default values
export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
});

// AuthProvider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;