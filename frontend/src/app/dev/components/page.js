'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Home, 
  Receipt, 
  CreditCard, 
  Settings, 
  Plus, 
  Check, 
  Filter, 
  Download, 
  AlertCircle 
} from 'lucide-react';

// Typography
import { Heading, Paragraph, Caption, Label } from '@/components/ui/typography';

// Buttons
import { Button, IconButton } from '@/components/ui/buttons';

// Inputs
import { TextInput, PasswordInput, NumberInput, Textarea, Select, Checkbox, SearchInput } from '@/components/ui/inputs';

// Badges
import { Badge, StatusBadge } from '@/components/ui/badges';

// Feedback
import { Spinner, Skeleton, Alert, LoadingState, ErrorState, EmptyState } from '@/components/ui/feedback';

// Data Display
import { Card, StatCard, Avatar, Tooltip, Pagination, DataTable } from '@/components/ui/data-display';

// Forms
import { FormField, FormSection, FormActions, FormErrorSummary } from '@/components/forms';

// Overlays
import { ModalWrapper, DrawerWrapper, ConfirmDialog } from '@/components/overlays';

// Navigation
import { Breadcrumb } from '@/components/navigation';

// Providers & Hooks
import { useToast } from '@/providers/ToastProvider';
import { useDisclosure } from '@/hooks/useDisclosure';
import { formatINR } from '@/lib/formatters/currency';

export default function ComponentShowcasePage() {
  const { showToast } = useToast();

  // Overlay states
  const modal = useDisclosure();
  const drawer = useDisclosure();
  const confirm = useDisclosure();

  // Input states
  const [textVal, setTextVal] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [selectVal, setSelectVal] = useState('');
  const [checkboxVal, setCheckboxVal] = useState(false);
  const [page, setPage] = useState(1);

  const sampleData = [
    { id: '1', tenant: 'Rajesh Sharma', unit: 'A-101', rent: 18500, status: 'PAID' },
    { id: '2', tenant: 'Priya Patel', unit: 'B-204', rent: 22000, status: 'PENDING' },
    { id: '3', tenant: 'Amit Verma', unit: 'C-302', rent: 15000, status: 'OVERDUE' },
  ];

  const tableColumns = [
    { key: 'tenant', header: 'Tenant' },
    { key: 'unit', header: 'Unit' },
    { 
      key: 'rent', 
      header: 'Monthly Rent', 
      render: (val) => <span className="font-medium text-slate-900">{formatINR(val)}</span> 
    },
    { 
      key: 'status', 
      header: 'Status', 
      render: (val) => <StatusBadge status={val} /> 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8 space-y-12 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'UI Showcase' }]} />
        <div className="flex items-center justify-between mt-3">
          <div>
            <Heading as="h1" size="xl">Component System Showcase</Heading>
            <Paragraph muted className="mt-1">
              Reusable Design System and Shared UI primitives for Rental Property Management.
            </Paragraph>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => showToast('Export initiated successfully', 'info')}
            >
              Export
            </Button>
            <Button 
              variant="primary" 
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => showToast('New property created', 'success')}
            >
              Add Property
            </Button>
          </div>
        </div>
      </div>

      {/* Typography */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <Heading as="h2" size="md" className="border-b pb-2">1. Typography</Heading>
        <div className="space-y-3">
          <Heading as="h1" size="xl">Heading XL — Property Overview</Heading>
          <Heading as="h2" size="lg">Heading LG — Financial Analytics</Heading>
          <Heading as="h3" size="md">Heading MD — Active Leases</Heading>
          <Paragraph size="md">
            Paragraph Medium: Standard body text used for descriptions, instructions, and notes.
          </Paragraph>
          <Paragraph size="sm" muted>
            Paragraph Small Muted: Secondary context or background information.
          </Paragraph>
          <Caption>Caption: Timestamp • Updated 2 minutes ago</Caption>
        </div>
      </section>

      {/* Buttons */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <Heading as="h2" size="md" className="border-b pb-2">2. Buttons</Heading>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" loading>Loading</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <IconButton aria-label="Settings">
            <Settings className="w-5 h-5" />
          </IconButton>
        </div>
      </section>

      {/* Badges & Status */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <Heading as="h2" size="md" className="border-b pb-2">3. Badges & Status</Heading>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="success">Active</Badge>
          <Badge variant="warning">Pending Review</Badge>
          <Badge variant="danger">Terminated</Badge>
          <Badge variant="info">In Progress</Badge>
          <Badge variant="neutral">Draft</Badge>
        </div>
        <div className="flex flex-wrap gap-2 items-center pt-2">
          <StatusBadge status="PAID" />
          <StatusBadge status="PENDING" />
          <StatusBadge status="OVERDUE" />
          <StatusBadge status="ACTIVE" />
          <StatusBadge status="VACANT" />
          <StatusBadge status="OCCUPIED" />
        </div>
      </section>

      {/* Inputs & Form Controls */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <Heading as="h2" size="md" className="border-b pb-2">4. Form Inputs</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TextInput
            label="Tenant Name"
            name="tenantName"
            value={textVal}
            onChange={(e) => setTextVal(e.target.value)}
            placeholder="e.g. John Doe"
            required
            helperText="Enter full legal name"
          />
          <PasswordInput
            label="Account Password"
            name="password"
            placeholder="••••••••"
            required
          />
          <NumberInput
            label="Monthly Rent (₹)"
            name="rentAmount"
            placeholder="25000"
            min={0}
            step={500}
          />
          <Select
            label="Unit Type"
            name="unitType"
            value={selectVal}
            onChange={(e) => setSelectVal(e.target.value)}
            placeholder="Select type"
            options={[
              { value: '1bhk', label: '1 BHK' },
              { value: '2bhk', label: '2 BHK' },
              { value: '3bhk', label: '3 BHK' },
            ]}
          />
          <SearchInput
            placeholder="Filter leases or tenants..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onClear={() => setSearchVal('')}
          />
          <div className="pt-6">
            <Checkbox
              label="Agrees to automated utility reconciliation"
              name="terms"
              checked={checkboxVal}
              onChange={(e) => setCheckboxVal(e.target.checked)}
            />
          </div>
        </div>
        <Textarea
          label="Notes / Special Terms"
          name="notes"
          placeholder="Specify deposit conditions or meter anomalies..."
          rows={3}
        />
      </section>

      {/* Data Display & Stat Cards */}
      <section className="space-y-4">
        <Heading as="h2" size="md">5. Dashboard Cards & Metrics</Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Total Monthly Revenue"
            value={formatINR(485000)}
            change="+8.4% from last month"
            changeType="positive"
            icon={<Receipt className="w-6 h-6" />}
          />
          <StatCard
            label="Active Leases"
            value="42 / 45"
            change="93.3% Occupancy"
            changeType="neutral"
            icon={<Building2 className="w-6 h-6" />}
          />
          <StatCard
            label="Pending Utility Settlements"
            value={formatINR(14250)}
            change="3 units overdue"
            changeType="negative"
            icon={<CreditCard className="w-6 h-6" />}
          />
        </div>
      </section>

      {/* Data Table */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <Heading as="h2" size="md" className="border-b pb-2">6. Data Table & Pagination</Heading>
        <DataTable columns={tableColumns} data={sampleData} />
        <div className="pt-4 flex justify-between items-center">
          <Caption>Showing 3 of 28 records</Caption>
          <Pagination page={page} totalPages={5} onPageChange={setPage} />
        </div>
      </section>

      {/* Feedback & Alerts */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <Heading as="h2" size="md" className="border-b pb-2">7. Feedback & Alerts</Heading>
        <div className="space-y-3">
          <Alert variant="info" title="Utility Meter Reading Cycle" message="Next sub-meter reading cycle begins on the 25th of this month." />
          <Alert variant="success" title="Settlement Confirmed" message="₹18,500 credited via NEFT (UTR: ICIC29481928)." dismissible />
          <Alert variant="warning" title="Lease Expiring Soon" message="Unit B-204 lease expires in 14 days." dismissible />
          <Alert variant="error" title="Payment Discrepancy" message="UTR registry rejected duplicate transaction hash." dismissible />
        </div>
      </section>

      {/* Overlays / Modals */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <Heading as="h2" size="md" className="border-b pb-2">8. Interactive Overlays & Notifications</Heading>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={modal.open}>Open Modal</Button>
          <Button variant="outline" onClick={drawer.open}>Open Drawer</Button>
          <Button variant="danger" onClick={confirm.open}>Trigger Confirmation</Button>
          <Button 
            variant="secondary" 
            onClick={() => showToast('Instant notification triggered!', 'info')}
          >
            Trigger Toast
          </Button>
        </div>

        {/* Modal Example */}
        <ModalWrapper isOpen={modal.isOpen} onClose={modal.close} title="Property Details">
          <p className="text-sm text-slate-600">
            Configure unit allocation, sub-meter multipliers, and default billing due days.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={modal.close}>Close</Button>
            <Button variant="primary" onClick={modal.close}>Save Changes</Button>
          </div>
        </ModalWrapper>

        {/* Drawer Example */}
        <DrawerWrapper isOpen={drawer.isOpen} onClose={drawer.close} title="Meter Telemetry History">
          <p className="text-sm text-slate-600">
            Recent electrical reading logs and differential calculations.
          </p>
        </DrawerWrapper>

        {/* Confirmation Dialog Example */}
        <ConfirmDialog
          isOpen={confirm.isOpen}
          onClose={confirm.close}
          onConfirm={() => {
            confirm.close();
            showToast('Item deleted successfully', 'error');
          }}
          danger
          title="Delete Property Unit?"
          message="This action cannot be undone. All active bill records must be settled first."
          confirmLabel="Delete Unit"
        />
      </section>
    </div>
  );
}

