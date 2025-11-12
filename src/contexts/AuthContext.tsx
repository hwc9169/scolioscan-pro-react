import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { authAPI, userAPI } from '../utils/api';
import type { CurrentUserResponse } from '../api/users';

interface AuthContextType {
  user: CurrentUserResponse | null;
  loading: boolean;
  login: (credentials: { user_id: string; user_pw: string }) => Promise<{ access_token: string; email: string; name: string; token_type: string; user_id: string }>;
  register: (userData: unknown) => Promise<unknown>;
  logout: () => void;
  updateUser: (userData: Partial<CurrentUserResponse>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<CurrentUserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('access_token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await userAPI.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('access_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: { user_id: string; user_pw: string }) => {
    const response = await authAPI.login(credentials);
    localStorage.setItem('access_token', response.data.access_token);
    await loadUser();
    return response.data;
  };

  const register = async (userData: unknown) => {
    const response = await authAPI.register(userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  const updateUser = (userData: Partial<CurrentUserResponse>) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...userData } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

