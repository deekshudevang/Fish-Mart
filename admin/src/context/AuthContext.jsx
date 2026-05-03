import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Create axios instance
const api = axios.create({ baseURL: '/api' });

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState('');

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('efm_access_token');
    const savedAdmin = localStorage.getItem('efm_admin');
    if (token && savedAdmin) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setAdmin(JSON.parse(savedAdmin));
      // Verify token is still valid
      api.get('/auth/admin/me')
        .then((res) => setAdmin(res.data))
        .catch(() => {
          // Try refresh
          refreshToken().catch(() => logout());
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    const refresh = localStorage.getItem('efm_refresh_token');
    if (!refresh) throw new Error('No refresh token');

    const { data } = await api.post('/auth/admin/refresh', { refreshToken: refresh });
    localStorage.setItem('efm_access_token', data.accessToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
    return data.accessToken;
  }, []);

  // Axios interceptor — auto-refresh on 401
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalReq = error.config;
        if (
          error.response?.status === 401 &&
          !originalReq._retry &&
          !originalReq.url.includes('/auth/')
        ) {
          originalReq._retry = true;
          try {
            const newToken = await refreshToken();
            originalReq.headers['Authorization'] = `Bearer ${newToken}`;
            return api(originalReq);
          } catch {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, [refreshToken]);

  const login = async (email, password) => {
    setLoginError('');
    try {
      const { data } = await api.post('/auth/admin/login', { email, password });
      localStorage.setItem('efm_access_token', data.accessToken);
      localStorage.setItem('efm_refresh_token', data.refreshToken);
      localStorage.setItem('efm_admin', JSON.stringify(data.admin));
      api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
      setAdmin(data.admin);
      return data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed';
      setLoginError(msg);
      throw new Error(msg);
    }
  };

  const logout = useCallback(() => {
    setAdmin(null);
    localStorage.removeItem('efm_access_token');
    localStorage.removeItem('efm_refresh_token');
    localStorage.removeItem('efm_admin');
    delete api.defaults.headers.common['Authorization'];
  }, []);

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading, loginError, api }}>
      {children}
    </AuthContext.Provider>
  );
}

export { api };
