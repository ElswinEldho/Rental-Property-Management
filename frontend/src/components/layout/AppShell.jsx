'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { TopBar, LogoutButton, NavItem } from '@/components/navigation';
import { Avatar } from '@/components/ui/data-display';
import { Building2, LayoutDashboard, Building, DoorOpen } from 'lucide-react';

/**
 * Common App Shell Layout for Admin and Tenant portals.
 * Integrates TopBar, brand identifier, sidebar navigation, user profile summary, and Logout action.
 *
 * @param {{
 *   title: string,
 *   roleBadge: string,
 *   children: React.ReactNode
 * }} props
 */
export function AppShell({ title, roleBadge, children }) {
  const { user } = useAuth();
  const pathname = usePathname();

  const userDisplayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
    : '';

  const isAdmin = user?.roles?.includes('ADMIN') || user?.roles?.includes('PROPERTY_MANAGER');

  const adminNavItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      active: pathname === '/admin/dashboard',
    },
    {
      label: 'Properties',
      href: '/admin/properties',
      icon: <Building className="h-5 w-5" />,
      active: pathname.startsWith('/admin/properties'),
    },
    {
      label: 'Rental Units',
      href: '/admin/units',
      icon: <DoorOpen className="h-5 w-5" />,
      active: pathname.startsWith('/admin/units'),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopBar
        left={
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
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

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {isAdmin && (
          <aside className="w-56 shrink-0 hidden md:block py-6 pr-6 border-r border-slate-200">
            <nav className="space-y-1">
              {adminNavItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={item.active}
                />
              ))}
            </nav>
          </aside>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;
