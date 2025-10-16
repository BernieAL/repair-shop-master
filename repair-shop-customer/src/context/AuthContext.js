import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await authAPI.getProfile();
        setUser(response.data);
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
  try {
    setError('');
    // TEMPORARY: Bypass backend for testing
    // TODO: Remove this and use real API call
    const mockUser = {
      id: 1,
      name: email.split('@')[0],
      email: email,
      role: 'customer'
    };
    const mockToken = 'mock-jwt-token-12345';
    
    localStorage.setItem('token', mockToken);
    setUser(mockUser);
    return true;
    
    // REAL CODE (comment out for now):
    // const response = await authAPI.login(email, password);
    // const { token, user } = response.data;
    // localStorage.setItem('token', token);
    // setUser(user);
    // return true;
  } catch (err) {
    setError(err.response?.data?.message || 'Login failed');
    return false;
  }
};

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const register = async (userData) => {
    try {
      setError('');
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};