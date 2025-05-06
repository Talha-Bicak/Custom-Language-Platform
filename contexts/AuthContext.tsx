import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Kullanıcı tipi tanımlama
type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Başlangıçta oturum durumunu kontrol et
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated]);

  const login = async (email: string, password: string) => {
    try {
      // Burada gerçek API çağrısı yapılacak
      // Şimdilik basit bir simülasyon
      if (email && password) {
        setIsAuthenticated(true);
        
        // Örnek kullanıcı verileri
        setUser({
          id: '1',
          name: 'Kullanıcı',
          email: email
        });
        
        router.replace('/home');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    router.replace('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}