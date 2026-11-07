'use client';

import { RouteGuard } from '@/components/navigation';
import { AppShell } from '@/components/layout';

export default function TenantLayout({ children }) {
  return (
    <RouteGuard allowedRoles={['TENANT']}>
      <AppShell title="Tenant Portal" roleBadge="Tenant">
        {children}
      </AppShell>
    </RouteGuard>
  );
}
