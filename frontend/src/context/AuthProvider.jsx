import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = (userData) => {
    setUser(userData);
    navigate('/chat');
  };

  const logout = () => {
    setUser(null);
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;