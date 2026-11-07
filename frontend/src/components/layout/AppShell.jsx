'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { TopBar, LogoutButton } from '@/components/navigation';
import { Avatar } from '@/components/ui/data-display';
import { Building2, Home } from 'lucide-react';

/**
 * Common App Shell Layout for Admin and Tenant portals.
 * Integrates TopBar, brand identifier, user profile summary, and Logout action.
 *
 * @param {{
 *   title: string,
 *   roleBadge: string,
 *   children: React.ReactNode
 * }} props
 */
export function AppShell({ title, roleBadge, children }) {
  const { user } = useAuth();

  const userDisplayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
    : '';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopBar
        left={
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 text-sm tracking-tight sm:text-base">
                Rental Property Management
              </span>
              <span className="ml-2 inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {roleBadge}
              </span>
            </div>
          </div>
        }
        right={
          <div className="flex items-center gap-3 sm:gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-2 text-right">
                <Avatar name={userDisplayName} size="sm" />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-medium text-slate-900 leading-tight">
                    {userDisplayName}
                  </span>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    {user.email}
                  </span>
                </div>
              </div>
            )}
            <LogoutButton variant="outline" size="sm" />
          </div>
        }
      />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}

export default AppShell;

