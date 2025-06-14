import React, { useState, useContext } from 'react';
import { User, Lock, Mail, LogIn, UserPlus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import '../styles/auth.css';

const Auth = () => {
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock login/signup logic
    const user = { email: formData.email, username: formData.username || formData.email };
    login(user);
  };

  const handleGoogleSignIn = () => {
    // Mock Google Sign-In
    const user = { email: 'googleuser@example.com', username: 'Google User' };
    login(user);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-toggle">
          <button
            className={`toggle-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            <LogIn size={18} /> Login
          </button>
          <button
            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            <UserPlus size={18} /> Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>
                <User size={18} />
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                required
              />
            </div>
          )}
          <div className="form-group">
            <label>
              <Mail size={18} />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>
              <Lock size={18} />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}{' '}
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="google-signin">
          <button onClick={handleGoogleSignIn} className="google-btn">
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;