'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false); // New state

  useEffect(() => {
    setMounted(true); // Set mounted to true after client-side hydration
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Optionally, verify token with backend or decode to get user info
      // For now, we'll assume token validity and fetch user info on dashboard load
    }
    setLoading(false);
  }, []);

  if (!mounted || loading) { // Only render children after mounted and not loading
    return null; // Or a loading spinner
  }

  const login = async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password });
      console.log('Login response data:', data);
      if (data.token) {
        console.log('Token received:', data.token);
        localStorage.setItem('token', data.token);
        setToken(data.token);
        // Fetch user data after successful login
        const userData = await api.get('/auth/me', data.token);
        console.log('User data after /auth/me:', userData);
        setUser(userData);
        return { success: true };
      } else {
        console.log('Login failed: No token in response');
        return { success: false, message: data.msg || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.message === 'Your account is awaiting admin approval.') {
        console.log('Your account is awaiting admin approval.');
        return { success: false, message: 'Your account is awaiting admin approval.' };
      }
      return { success: false, message: error.message || 'Server error during login' };
    }
  };

  const register = async (email, password, username) => {
    try {
      const data = await api.post('/auth/register', { email, password, username });
      if (data.msg) {
        return { success: true, message: data.msg };
      } else {
        return { success: false, message: data.msg || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Server error during registration' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
