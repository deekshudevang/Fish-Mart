import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext(null);

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}

const api = axios.create({ 
  baseURL: '/api',
  withCredentials: true // Crucial for sending/receiving cookies
});

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session
  useEffect(() => {
    const savedUser = localStorage.getItem('efm_customer');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Always verify with backend to ensure cookie is still valid
    api.get('/users/me')
      .then((res) => {
        setUser(res.data);
        localStorage.setItem('efm_customer', JSON.stringify(res.data));
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  const loginWithGoogle = async (credential) => {
    try {
      console.log('Sending Google credential to backend...');
      const { data } = await api.post('/users/google-login', { credential });
      localStorage.setItem('efm_customer', JSON.stringify(data.user));
      setUser(data.user);
      console.log('User logged in successfully:', data.user.email);
      return data;
    } catch (err) {
      console.error('Login failed:', err.response?.data?.error || err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/users/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('efm_customer');
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </UserContext.Provider>
  );
}
