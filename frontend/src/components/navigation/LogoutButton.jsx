'use client';

import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';
import { Button } from '@/components/ui/buttons';

/**
 * Reusable Logout Button Component for Navigation Bars and Sidebars.
 *
 * @param {{
 *   variant?: 'ghost'|'outline'|'secondary'|'danger'|'primary',
 *   size?: 'sm'|'md'|'lg',
 *   showLabel?: boolean,
 *   className?: string
 * }} props
 */
export function LogoutButton({
  variant = 'ghost',
  size = 'sm',
  showLabel = true,
  className,
}) {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      showToast('Logged out successfully.', 'info');
    } catch (err) {
      showToast(err.message || 'Logout encountered an issue, but local session was cleared.', 'warning');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      loading={loading}
      disabled={loading}
      leftIcon={!loading && <LogOut className="h-4 w-4" />}
      aria-label="Log out"
      className={className}
    >
      {showLabel && (loading ? 'Signing out...' : 'Sign out')}
    </Button>
  );
}

export default LogoutButton;

