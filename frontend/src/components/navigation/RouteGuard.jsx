'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { LoadingState } from '@/components/ui/feedback';

/**
 * Route Guard Component for role protection and browser navigation security.
 * Revalidates session and uses router.replace to avoid trapping browser back history.
 *
 * @param {object} props
 * @param {string[]} [props.allowedRoles]
 * @param {React.ReactNode} props.children
 */
export function RouteGuard({ allowedRoles = [], children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace('/login');
      } else if (allowedRoles.length > 0) {
        const hasRole = allowedRoles.some((r) => user?.roles?.includes(r));
        if (!hasRole) {
          router.replace(user?.roles?.includes('TENANT') ? '/tenant/dashboard' : '/admin/dashboard');
        }
      }
    }
  }, [loading, isAuthenticated, user, allowedRoles, router]);

  // If session is verifying or user is not authenticated, never render sensitive children
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState message="Verifying authentication session..." />
      </div>
    );
  }

  // Role validation check
  if (allowedRoles.length > 0) {
    const hasRole = allowedRoles.some((r) => user?.roles?.includes(r));
    if (!hasRole) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingState message="Redirecting to authorized portal..." />
        </div>
      );
    }
  }

  return children;
}

export default RouteGuard;
