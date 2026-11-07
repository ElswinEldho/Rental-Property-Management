'use client';

import { RouteGuard } from '@/components/navigation';
import { AppShell } from '@/components/layout';

export default function AdminLayout({ children }) {
  return (
    <RouteGuard allowedRoles={['ADMIN', 'PROPERTY_MANAGER']}>
      <AppShell title="Admin Portal" roleBadge="Admin">
        {children}
      </AppShell>
    </RouteGuard>
  );
}
