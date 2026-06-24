import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useToast } from '../hooks/useToast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const getCurrentUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/current-user');
      setUser(data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  const registerUser = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      setUser(data.user);
      showToast('Registration successful! Welcome to JobTrackr.', 'success');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.msg || 'Registration failed';
      showToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data.user);
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.msg || 'Invalid credentials';
      showToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await api.get('/auth/logout');
      setUser(null);
      showToast('Logged out successfully', 'success');
    } catch (error) {
      showToast('Logout failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register: registerUser,
        login: loginUser,
        logout: logoutUser,
        refreshUser: getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
