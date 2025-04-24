'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Types
export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is logged in on initial load
  useEffect(() => {
    let isMounted = true;

    const checkUserLoggedIn = async () => {
      try {
        console.log('Checking if user is logged in...');

        // Don't clear user data immediately to prevent flashing
        // Only update state if the component is still mounted

        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include', // Important for cookies
          cache: 'no-store', // Prevent caching
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });

        console.log('Auth check response status:', res.status);

        if (!isMounted) return;

        if (res.ok) {
          const data = await res.json();
          console.log('User is logged in:', data.user);

          if (data.user && data.user.id) {
            setUser(data.user);
          } else {
            console.log('User data is invalid');
            setUser(null);
          }
        } else {
          console.log('User is not logged in');
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkUserLoggedIn();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      console.log('Login attempt for:', email);
      setLoading(true);
      setError(null);

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for cookies
        cache: 'no-store', // Prevent caching
      });

      console.log('Login response status:', res.status);
      const data = await res.json();
      console.log('Login response data:', data);

      if (!res.ok) {
        console.error('Login failed:', data.message);
        throw new Error(data.message || 'Login failed');
      }

      console.log('Login successful, user:', data.user);

      // Set user data from response
      if (data.user && data.user.id) {
        setUser(data.user);

        // Use router for navigation instead of direct page refresh
        console.log('Redirecting to admin page');
        router.push('/admin');
      } else {
        throw new Error('Invalid user data received from server');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
      console.error('Login error:', errorMessage);
      setError(errorMessage);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log('Logging out...');
      setLoading(true);
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Important for cookies
        cache: 'no-store', // Prevent caching
      });

      console.log('Logout response status:', res.status);

      if (!res.ok) {
        const data = await res.json();
        console.error('Logout failed:', data.message);
        throw new Error(data.message || 'Logout failed');
      }

      console.log('Logout successful');
      setUser(null);

      // Force a page refresh to ensure cookies are cleared
      console.log('Forcing page refresh to /login');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name?: string) => {
    try {
      console.log('Registering new user:', email);
      setLoading(true);
      setError(null);

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
        credentials: 'include', // Important for cookies
        cache: 'no-store', // Prevent caching
      });

      console.log('Registration response status:', res.status);
      const data = await res.json();
      console.log('Registration response data:', data);

      if (!res.ok) {
        console.error('Registration failed:', data.message);
        throw new Error(data.message || 'Registration failed');
      }

      console.log('Registration successful');

      // Set user directly from registration response
      setUser(data.user);

      // Use router for navigation
      console.log('Redirecting to admin page');
      router.push('/admin');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
      console.error('Registration error:', errorMessage);
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        register,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
