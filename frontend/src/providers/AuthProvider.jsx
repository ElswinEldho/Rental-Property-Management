'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import apiClient from '@/lib/api/apiClient';

const AuthContext = createContext(null);

const VISIT_SESSION_KEY = 'rpm_app_visit_active';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isRefreshingRef = useRef(false);

  const logout = useCallback(async () => {
    try {
      sessionStorage.removeItem(VISIT_SESSION_KEY);
      await apiClient.post('/auth/logout', {});
    } catch (e) {
      // Continue client cleanup even if network request fails
    } finally {
      sessionStorage.removeItem(VISIT_SESSION_KEY);
      setUser(null);
      router.replace('/login');
    }
  }, [router]);

  // Initialize and revalidate session against backend /auth/me
  const initSession = useCallback(async (isSilent = false) => {
    if (!isSilent) {
      setLoading(true);
    }

    // Check application visit marker:
    // If the browser entered via back/forward from outside or opened fresh without an active visit marker,
    // require fresh credentials at /login and revoke previous session.
    if (typeof window !== 'undefined') {
      const perfEntries = performance.getEntriesByType?.('navigation');
      const navEntry = perfEntries?.[0];
      const navType = navEntry?.type || (performance?.navigation?.type === 2 ? 'back_forward' : 'navigate');
      const isVisitActive = sessionStorage.getItem(VISIT_SESSION_KEY) === 'true';

      if (navType === 'back_forward' && !isVisitActive) {
        if (window.location.pathname !== '/login') {
          await logout();
          if (!isSilent) setLoading(false);
          return null;
        }
      }
    }

    try {
      const res = await apiClient.get('/auth/me');
      if (res?.data?.user) {
        // If user is returned by server, mark visit as active in current window session
        sessionStorage.setItem(VISIT_SESSION_KEY, 'true');
        setUser(res.data.user);
        return res.data.user;
      } else {
        sessionStorage.removeItem(VISIT_SESSION_KEY);
        setUser(null);
        return null;
      }
    } catch (err) {
      // If access token is expired, attempt seamless token refresh ONLY if visit session is active
      const isVisitActive = typeof window !== 'undefined' && sessionStorage.getItem(VISIT_SESSION_KEY) === 'true';

      if (err.statusCode === 401 && isVisitActive && !isRefreshingRef.current) {
        try {
          isRefreshingRef.current = true;
          const refreshRes = await apiClient.post('/auth/refresh', {});
          if (refreshRes?.data?.user) {
            setUser(refreshRes.data.user);
            return refreshRes.data.user;
          }
        } catch (refreshErr) {
          sessionStorage.removeItem(VISIT_SESSION_KEY);
          setUser(null);
          return null;
        } finally {
          isRefreshingRef.current = false;
        }
      }
      sessionStorage.removeItem(VISIT_SESSION_KEY);
      setUser(null);
      return null;
    } finally {
      if (!isSilent) {
        setLoading(false);
      }
    }
  }, [logout]);

  // Initial load session check
  useEffect(() => {
    initSession();
  }, [initSession]);

  // Detect application exit vs internal navigation:
  // When window unloads without internal Next.js client transition (e.g. browser Back to external domain),
  // clear visit marker so returning via Back requires fresh login.
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear the active session marker when leaving the page/origin
      sessionStorage.removeItem(VISIT_SESSION_KEY);
    };

    const handlePageShow = (event) => {
      const isVisitActive = sessionStorage.getItem(VISIT_SESSION_KEY) === 'true';
      const perfEntries = performance.getEntriesByType?.('navigation');
      const navEntry = perfEntries?.[0];
      const navType = navEntry?.type || (performance?.navigation?.type === 2 ? 'back_forward' : 'navigate');

      // If page is restored from bfcache or history traversal and visit is not active
      if (event.persisted || navType === 'back_forward') {
        if (!isVisitActive) {
          if (window.location.pathname !== '/login') {
            logout();
          }
        } else {
          initSession(true);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [initSession, logout]);

  const login = async (identifier, password) => {
    const res = await apiClient.post('/auth/login', { identifier, password });
    if (res?.data?.user) {
      sessionStorage.setItem(VISIT_SESSION_KEY, 'true');
      setUser(res.data.user);

      // Auto-redirect using history replacement so login is not retained in back history
      const roles = res.data.user.roles || [];
      if (roles.includes('ADMIN') || roles.includes('PROPERTY_MANAGER')) {
        router.replace('/admin/dashboard');
      } else if (roles.includes('TENANT')) {
        router.replace('/tenant/dashboard');
      } else {
        router.replace('/login');
      }
    }
    return res;
  };

  const refreshSession = async () => {
    try {
      const res = await apiClient.post('/auth/refresh', {});
      if (res?.data?.user) {
        setUser(res.data.user);
        return res.data.user;
      }
    } catch (err) {
      sessionStorage.removeItem(VISIT_SESSION_KEY);
      setUser(null);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.roles?.includes('ADMIN') || user?.roles?.includes('PROPERTY_MANAGER'),
        isTenant: user?.roles?.includes('TENANT'),
        login,
        logout,
        refreshSession,
        refetchUser: initSession,
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

export default AuthProvider;
