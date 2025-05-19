import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Kullanıcı tipi tanımlama
type User = {
  id: string;
  name: string;
  email: string;
};

type Word = {
  id: string;
  word: string;
  meaning: string;
  example: string;
  category: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  savedWords: Word[];
  saveWord: (word: Word) => Promise<void>;
  removeWord: (wordId: string) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [savedWords, setSavedWords] = useState<Word[]>([]);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/auth/login');
      }
    }
  }, [isAuthenticated, isLoading]);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setIsAuthenticated(true);
        // Burada token doğrulama işlemi yapılabilir
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const loadSavedWords = async () => {
    try {
      const saved = await AsyncStorage.getItem('savedWords');
      if (saved) {
        setSavedWords(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Kaydedilen kelimeler yüklenirken hata:', error);
    }
  };

  const saveWord = async (word: Word) => {
    try {
      const updatedWords = [...savedWords, word];
      await AsyncStorage.setItem('savedWords', JSON.stringify(updatedWords));
      setSavedWords(updatedWords);
    } catch (error) {
      console.error('Kelime kaydedilirken hata:', error);
    }
  };

  const removeWord = async (wordId: string) => {
    try {
      const updatedWords = savedWords.filter(word => word.id !== wordId);
      await AsyncStorage.setItem('savedWords', JSON.stringify(updatedWords));
      setSavedWords(updatedWords);
    } catch (error) {
      console.error('Kelime silinirken hata:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, savedWords, saveWord, removeWord }}>
      {children}
    </AuthContext.Provider>
  );
}