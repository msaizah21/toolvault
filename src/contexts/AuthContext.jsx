import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

// Set axios defaults
axios.defaults.baseURL = 'http://localhost:5000';

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      getCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const getCurrentUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setUser(res.data);
    } catch (error) {
      console.error('Get user error:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      // MOCK AUTHENTICATION - Remove this when backend is ready
      if (process.env.NODE_ENV === 'development') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockUser = {
          id: '123',
          email: userData.email,
          name: userData.name || 'User'
        };
        
        const mockToken = 'mock-jwt-token-' + Date.now();
        localStorage.setItem('token', mockToken);
        setUser(mockUser);
        
        toast.success('Registration successful!');
        return { success: true };
      }
      // END MOCK

      const res = await axios.post('/api/auth/register', userData);
      const { token } = res.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(res.data);
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const login = async (credentials) => {
    try {
      // MOCK AUTHENTICATION - Remove this when backend is ready
      if (process.env.NODE_ENV === 'development') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check for demo credentials
        if (credentials.email === 'admin@toolvault.com' && credentials.password === 'password123') {
          const mockUser = {
            id: '123',
            email: credentials.email,
            name: 'Admin User'
          };
          
          const mockToken = 'mock-jwt-token-' + Date.now();
          localStorage.setItem('token', mockToken);
          setUser(mockUser);
          
          toast.success('Login successful!');
          return { success: true };
        } else {
          toast.error('Invalid credentials. Use demo credentials.');
          return { success: false, error: 'Invalid email or password' };
        }
      }
      // END MOCK

      const res = await axios.post('/api/auth/login', credentials);
      const { token } = res.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(res.data);
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};