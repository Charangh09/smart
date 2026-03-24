import { createContext, useContext, useMemo, useState } from 'react';

import { loginApi, signupApi } from '../api/authApi';
import { notifyError, notifySuccess } from '../utils/notify';

const AuthContext = createContext(null);

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch (error) {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  const persistAuth = (payload) => {
    setUser(payload.user);
    setToken(payload.token);
    localStorage.setItem('user', JSON.stringify(payload.user));
    localStorage.setItem('token', payload.token);
  };

  const signup = async (formData) => {
    setLoading(true);
    try {
      const data = await signupApi(formData);
      persistAuth(data);
      notifySuccess('Account created successfully');
      return true;
    } catch (error) {
      notifyError(error?.response?.data?.message || 'Failed to sign up');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    setLoading(true);
    try {
      const data = await loginApi(formData);
      persistAuth(data);
      notifySuccess('Welcome back');
      return true;
    } catch (error) {
      notifyError(error?.response?.data?.message || 'Failed to login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    notifySuccess('Logged out');
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      signup,
      login,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
