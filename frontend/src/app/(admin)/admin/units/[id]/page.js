'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { rentalUnitService } from '@/services/rentalUnitService';
import { useToast } from '@/providers/ToastProvider';
import { Heading, Paragraph } from '@/components/ui/typography';
import { Button } from '@/components/ui/buttons';
import { StatusBadge } from '@/components/ui/badges';
import { LoadingState, Alert, EmptyState } from '@/components/ui/feedback';
import { StatCard } from '@/components/ui/data-display';
import {
  DoorOpen,
  Building,
  ArrowLeft,
  Edit3,
  Calendar,
  Zap,
  User,
  ShieldCheck,
  Tag,
} from 'lucide-react';

export default function UnitDetailPage() {
  const params = useParams();
  const unitId = params?.id;
  const router = useRouter();
  const { showToast } = useToast();

  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchUnit = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const res = await rentalUnitService.getUnitById(unitId);
      setUnit(res.data);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load rental unit details.');
      showToast({ title: 'Error', message: 'Failed to load unit', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (unitId) {
      fetchUnit();
    }
  }, [unitId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12">
        <LoadingState message="Loading rental unit..." />
      </div>
    );
  }

  if (errorMessage || !unit) {
    return (
      <div className="space-y-4">
        <Link href="/admin/units">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
            Back to Units
          </Button>
        </Link>
        <Alert variant="error" title="Error Loading Unit">
          {errorMessage || 'Rental unit not found.'}
        </Alert>
      </div>
    );
  }

  const activeTenancy = unit.tenancyAgreements?.[0] || null;

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href={`/admin/units?propertyId=${unit.propertyId}`}>
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
              Back
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <Heading level={1} className="text-2xl font-bold text-slate-900">
                Unit {unit.unitNumber}
              </Heading>
              <StatusBadge status={unit.occupancyStatus} />
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <Building className="h-3.5 w-3.5 text-slate-400" />
              <Link
                href={`/admin/properties/${unit.propertyId}`}
                className="hover:text-brand-600 underline font-medium text-slate-700"
              >
                {unit.property?.name}
              </Link>
              <span>• {unit.property?.city}, {unit.property?.stateProvince}</span>
            </p>
          </div>
        </div>

        <Link href={`/admin/units/${unit.id}/edit`}>
          <Button variant="outline" size="sm" icon={<Edit3 className="h-4 w-4" />}>
            Edit Unit
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Base Monthly Rent"
          value={`₹${Number(unit.baseRentAmount).toLocaleString('en-IN')}`}
          icon={<Tag className="h-5 w-5 text-brand-600" />}
        />
        <StatCard
          title="Unit Type"
          value={unit.unitType}
        />
        <StatCard
          title="Floor Level"
          value={unit.floor !== null ? `Floor ${unit.floor}` : 'Ground / N/A'}
        />
        <StatCard
          title="Electricity Meter"
          value={unit.electricityMeter ? unit.electricityMeter.meterNumber : 'Not Assigned'}
          icon={<Zap className="h-5 w-5 text-amber-600" />}
        />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Specification */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <DoorOpen className="h-4 w-4 text-brand-600" />
            Unit Specifications
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Unit Identifier</span>
              <span className="font-medium text-slate-900">{unit.unitNumber}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Classification</span>
              <span className="font-medium text-slate-900">{unit.unitType}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Floor Level</span>
              <span className="font-medium text-slate-900">{unit.floor !== null ? unit.floor : 'Ground / Single'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Availability Status</span>
              <span className="font-medium text-slate-900">{unit.occupancyStatus}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Base Monthly Rent</span>
              <span className="font-semibold text-emerald-700">₹{Number(unit.baseRentAmount).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Created On</span>
              <span className="text-slate-700">{new Date(unit.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Current Active Tenancy Agreement */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <User className="h-4 w-4 text-brand-600" />
            Tenancy Status
          </h2>

          {activeTenancy ? (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Active Agreement</span>
                  <StatusBadge status={activeTenancy.status} />
                </div>
                <p className="text-sm font-bold text-emerald-950 mt-1">
                  Agreement #{activeTenancy.agreementNumber}
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Primary Tenant</span>
                  <span className="font-semibold text-slate-900">
                    {activeTenancy.primaryTenant
                      ? `${activeTenancy.primaryTenant.firstName} ${activeTenancy.primaryTenant.lastName}`
                      : 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Contact Email</span>
                  <span className="text-slate-700">{activeTenancy.primaryTenant?.email || '-'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Lease Period</span>
                  <span className="text-slate-700">
                    {new Date(activeTenancy.startDate).toLocaleDateString()} – {new Date(activeTenancy.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Agreed Water Charge</span>
                  <span className="font-medium text-slate-900">₹{Number(activeTenancy.fixedWaterCharge || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={<ShieldCheck className="h-8 w-8 text-slate-400" />}
              title="No Active Tenancy"
              description="This rental unit is currently not leased to any tenant."
            />
          )}
        </div>
      </div>
    </div>
  );
}

