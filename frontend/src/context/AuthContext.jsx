import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cleanup: Remove any old user data from localStorage (migration)
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    
    if (token) {
      // Fetch user data from API instead of localStorage
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.user);
      setCustomer(response.data.customer);
    } catch (error) {
      console.error('Failed to fetch profile:', error.response?.status, error.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user, customer } = response.data;
      
      // Only store token in localStorage
      localStorage.setItem('token', token);
      
      // Store user data in memory (React state)
      setUser(user);
      setCustomer(customer);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  };

  const register = async (data) => {
    try {
      const response = await authAPI.register(data);
      const { token, user, customer } = response.data;
      
      // Only store token in localStorage
      localStorage.setItem('token', token);
      
      // Store user data in memory (React state)
      setUser(user);
      setCustomer(customer);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
      };
    }
  };

  const logout = () => {
    // Only remove token from localStorage
    localStorage.removeItem('token');
    
    // Clear in-memory state
    setUser(null);
    setCustomer(null);
  };

  const updateCustomer = (updatedCustomer) => {
    setCustomer(updatedCustomer);
  };

  const value = {
    user,
    customer,
    loading,
    login,
    register,
    logout,
    updateCustomer,
    fetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

