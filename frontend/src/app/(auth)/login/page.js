'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';
import { Heading, Paragraph } from '@/components/ui/typography';
import { TextInput, PasswordInput } from '@/components/ui/inputs';
import { Button } from '@/components/ui/buttons';
import { Alert, LoadingState } from '@/components/ui/feedback';
import { Building2 } from 'lucide-react';

export default function LoginPage() {
  const { user, login, loading: authLoading, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Scenario A requirement: If already authenticated, redirect away from login page immediately
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      const roles = user.roles || [];
      if (roles.includes('ADMIN') || roles.includes('PROPERTY_MANAGER')) {
        router.replace('/admin/dashboard');
      } else if (roles.includes('TENANT')) {
        router.replace('/tenant/dashboard');
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  const validate = () => {
    const errors = {};
    if (!identifier.trim()) {
      errors.identifier = 'Email or phone number is required';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      await login(identifier, password);
      showToast('Login successful!', 'success');
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingState message="Checking session status..." />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 mb-2">
            <Building2 className="h-6 w-6" />
          </div>
          <Heading as="h1" size="lg">Sign in to your account</Heading>
          <Paragraph size="sm" muted>
            Rental Property Management — Admin & Tenant Portal
          </Paragraph>
        </div>

        {errorMessage && (
          <Alert variant="error" message={errorMessage} dismissible onDismiss={() => setErrorMessage('')} />
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <TextInput
            label="Email or Phone"
            name="identifier"
            id="identifier"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (validationErrors.identifier) {
                setValidationErrors((prev) => ({ ...prev, identifier: undefined }));
              }
            }}
            placeholder="admin@rentalsystem.local or phone"
            required
            disabled={loading}
            error={validationErrors.identifier}
          />

          <PasswordInput
            label="Password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (validationErrors.password) {
                setValidationErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            placeholder="••••••••"
            required
            disabled={loading}
            error={validationErrors.password}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            loading={loading}
            disabled={loading}
          >
            Sign In
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Protected by HttpOnly Secure Session Cookies & RBAC.
          </p>
        </div>
      </div>
    </div>
  );
}
