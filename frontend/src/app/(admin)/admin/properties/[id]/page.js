'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { propertyService } from '@/services/propertyService';
import { useToast } from '@/providers/ToastProvider';
import { Heading, Paragraph } from '@/components/ui/typography';
import { Button } from '@/components/ui/buttons';
import { StatusBadge } from '@/components/ui/badges';
import { LoadingState, Alert, EmptyState } from '@/components/ui/feedback';
import { StatCard } from '@/components/ui/data-display';
import {
  Building,
  MapPin,
  ArrowLeft,
  Edit3,
  CreditCard,
  DoorOpen,
  Calendar,
  Layers,
  Plus,
  ArrowRight,
} from 'lucide-react';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const propertyId = params?.id;
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const res = await propertyService.getPropertyById(propertyId);
      setProperty(res.data);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load property details.');
      showToast({ title: 'Error', message: 'Failed to load property details', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12">
        <LoadingState message="Loading property details..." />
      </div>
    );
  }

  if (errorMessage || !property) {
    return (
      <div className="space-y-4">
        <Link href="/admin/properties">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
            Back to Properties
          </Button>
        </Link>
        <Alert variant="error" title="Error Loading Property">
          {errorMessage || 'Property not found.'}
        </Alert>
      </div>
    );
  }

  const units = property.rentalUnits || [];
  const totalUnits = units.length;
  const occupiedUnits = units.filter((u) => u.occupancyStatus === 'OCCUPIED').length;
  const vacantUnits = units.filter((u) => u.occupancyStatus === 'VACANT').length;
  const maintenanceUnits = units.filter((u) => u.occupancyStatus === 'MAINTENANCE').length;

  return (
    <div className="space-y-6">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/properties">
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
              Back
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <Heading level={1} className="text-2xl font-bold text-slate-900">
                {property.name}
              </Heading>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>
                {property.addressLine1}
                {property.addressLine2 ? `, ${property.addressLine2}` : ''}, {property.city},{' '}
                {property.stateProvince} - {property.postalCode}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/admin/units/new?propertyId=${property.id}`}>
            <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />}>
              Add Unit
            </Button>
          </Link>
          <Link href={`/admin/properties/${property.id}/edit`}>
            <Button variant="outline" size="sm" icon={<Edit3 className="h-4 w-4" />}>
              Edit Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Units"
          value={totalUnits}
          icon={<DoorOpen className="h-5 w-5 text-brand-600" />}
        />
        <StatCard
          title="Occupied"
          value={occupiedUnits}
          description={totalUnits > 0 ? `${((occupiedUnits / totalUnits) * 100).toFixed(0)}% occupancy` : 'No units'}
        />
        <StatCard
          title="Vacant"
          value={vacantUnits}
          description="Ready to lease"
        />
        <StatCard
          title="Under Maintenance"
          value={maintenanceUnits}
          description="Inactive units"
        />
      </div>

      {/* Property Information Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <Building className="h-4 w-4 text-brand-600" />
            Property Details
          </h2>

          <div className="space-y-3 text-sm">
            <div>
              <span className="block text-xs text-slate-400">City / State</span>
              <span className="font-medium text-slate-800">
                {property.city}, {property.stateProvince} ({property.country})
              </span>
            </div>

            <div>
              <span className="block text-xs text-slate-400">Postal Code</span>
              <span className="font-medium text-slate-800">{property.postalCode}</span>
            </div>

            <div>
              <span className="block text-xs text-slate-400">Created At</span>
              <span className="font-medium text-slate-800">
                {new Date(property.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider pt-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-brand-600" />
            UPI Payment Info
          </h2>

          <div className="space-y-3 text-sm">
            <div>
              <span className="block text-xs text-slate-400">UPI VPA</span>
              <span className="font-medium text-slate-800">{property.upiId || 'Not configured'}</span>
            </div>

            <div>
              <span className="block text-xs text-slate-400">Beneficiary Name</span>
              <span className="font-medium text-slate-800">{property.upiPayeeName || 'Not configured'}</span>
            </div>
          </div>
        </div>

        {/* Associated Units Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4 text-brand-600" />
              Units ({totalUnits})
            </h2>
            <Link
              href={`/admin/units?propertyId=${property.id}`}
              className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
            >
              View in Units Manager
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {units.length === 0 ? (
            <EmptyState
              icon={<DoorOpen className="h-8 w-8 text-slate-400" />}
              title="No rental units yet"
              description="This property does not have any units added yet."
              action={
                <Link href={`/admin/units/new?propertyId=${property.id}`}>
                  <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />}>
                    Add First Unit
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase">
                    <th className="py-2.5 px-3">Unit Number</th>
                    <th className="py-2.5 px-3">Floor</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Base Rent</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {units.map((unit) => (
                    <tr key={unit.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-medium text-slate-900">
                        <Link href={`/admin/units/${unit.id}`} className="hover:text-brand-600">
                          {unit.unitNumber}
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{unit.floor !== null && unit.floor !== undefined ? `Floor ${unit.floor}` : '-'}</td>
                      <td className="py-3 px-3 text-slate-600">{unit.unitType}</td>
                      <td className="py-3 px-3 font-medium text-slate-900">₹{Number(unit.baseRentAmount).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3">
                        <StatusBadge status={unit.occupancyStatus} />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link href={`/admin/units/${unit.id}`}>
                          <Button variant="ghost" size="sm">
                            Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
