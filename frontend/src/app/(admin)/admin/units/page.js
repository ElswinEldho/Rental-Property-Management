'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { rentalUnitService } from '@/services/rentalUnitService';
import { propertyService } from '@/services/propertyService';
import { useToast } from '@/providers/ToastProvider';
import { Heading, Paragraph } from '@/components/ui/typography';
import { Button } from '@/components/ui/buttons';
import { SearchInput, Select } from '@/components/ui/inputs';
import { StatusBadge } from '@/components/ui/badges';
import { EmptyState, LoadingState, Alert } from '@/components/ui/feedback';
import { StatCard, Pagination } from '@/components/ui/data-display';
import { Plus, DoorOpen, Building, Eye, Edit3, ArrowUpDown, Filter } from 'lucide-react';

export default function RentalUnitsListPage() {
  const searchParams = useSearchParams();
  const initialPropertyId = searchParams.get('propertyId') || '';

  const { showToast } = useToast();

  const [units, setUnits] = useState([]);
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [propertyId, setPropertyId] = useState(initialPropertyId);
  const [unitType, setUnitType] = useState('');
  const [occupancyStatus, setOccupancyStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const [unitsRes, statsRes, propsRes] = await Promise.all([
        rentalUnitService.listUnits({
          search,
          propertyId: propertyId || undefined,
          unitType: unitType || undefined,
          occupancyStatus: occupancyStatus || undefined,
          page,
          limit: 12,
        }),
        rentalUnitService.getUnitStats(propertyId || undefined).catch(() => ({ data: null })),
        propertyService.listProperties({ limit: 100 }).catch(() => ({ data: [] })),
      ]);

      setUnits(unitsRes.data || []);
      if (unitsRes.pagination) {
        setTotalPages(unitsRes.pagination.totalPages || 1);
      }
      if (statsRes?.data) {
        setStats(statsRes.data);
      }
      if (propsRes?.data) {
        setProperties(propsRes.data);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load rental units.');
      showToast({ title: 'Error', message: 'Failed to load units', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, [propertyId, unitType, occupancyStatus, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUnits();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Heading level={1} className="text-2xl font-bold text-slate-900">
            Rental Units
          </Heading>
          <Paragraph className="text-sm text-slate-500 mt-1">
            Manage individual apartments, rooms, kitchens, and godowns across your portfolio.
          </Paragraph>
        </div>

        <Link href="/admin/units/new">
          <Button variant="primary" icon={<Plus className="h-4 w-4" />}>
            Add Rental Unit
          </Button>
        </Link>
      </div>

      {/* Aggregate Statistics */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Units"
            value={stats.total}
            icon={<DoorOpen className="h-5 w-5 text-brand-600" />}
          />
          <StatCard
            title="Occupied"
            value={stats.occupied}
            description={stats.total > 0 ? `${stats.occupancyRate}% occupancy` : '0%'}
          />
          <StatCard
            title="Vacant"
            value={stats.vacant}
            description="Available to lease"
          />
          <StatCard
            title="Maintenance / Inactive"
            value={stats.maintenance + stats.inactive}
            description="Unavailable units"
          />
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="flex-1">
            <SearchInput
              placeholder="Search by unit number, type, or property name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Filter by Property</label>
            <select
              className="w-full text-xs rounded-lg border border-slate-300 py-1.5 px-2.5 focus:border-brand-500 focus:outline-none"
              value={propertyId}
              onChange={(e) => {
                setPropertyId(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Properties</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Filter by Unit Type</label>
            <select
              className="w-full text-xs rounded-lg border border-slate-300 py-1.5 px-2.5 focus:border-brand-500 focus:outline-none"
              value={unitType}
              onChange={(e) => {
                setUnitType(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Types</option>
              <option value="1BHK">1BHK</option>
              <option value="2BHK">2BHK</option>
              <option value="3BHK">3BHK</option>
              <option value="RK">RK</option>
              <option value="Single Room">Single Room</option>
              <option value="Godown">Godown</option>
              <option value="Independent House">Independent House</option>
              <option value="Commercial Kitchen">Commercial Kitchen</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Filter by Status</label>
            <select
              className="w-full text-xs rounded-lg border border-slate-300 py-1.5 px-2.5 focus:border-brand-500 focus:outline-none"
              value={occupancyStatus}
              onChange={(e) => {
                setOccupancyStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Statuses</option>
              <option value="VACANT">Vacant</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {errorMessage && (
        <Alert variant="error" title="Error">
          {errorMessage}
        </Alert>
      )}

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12">
          <LoadingState message="Loading rental units..." />
        </div>
      ) : units.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12">
          <EmptyState
            icon={<DoorOpen className="h-10 w-10 text-slate-400" />}
            title="No units found"
            description={
              search || propertyId || unitType || occupancyStatus
                ? 'No units match your active filter criteria. Try resetting your search filters.'
                : 'No rental units registered yet. Add your first unit to start leasing.'
            }
            action={
              <Link href="/admin/units/new">
                <Button variant="primary" icon={<Plus className="h-4 w-4" />}>
                  Add Rental Unit
                </Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Unit Number</th>
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Floor</th>
                    <th className="py-3 px-4">Base Rent</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Current Tenancy</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {units.map((unit) => (
                    <tr key={unit.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <Link
                          href={`/admin/units/${unit.id}`}
                          className="hover:text-brand-600 flex items-center gap-1.5"
                        >
                          <DoorOpen className="h-4 w-4 text-slate-400" />
                          {unit.unitNumber}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <Link
                          href={`/admin/properties/${unit.propertyId}`}
                          className="hover:text-brand-600 flex items-center gap-1"
                        >
                          <Building className="h-3.5 w-3.5 text-slate-400" />
                          <span>{unit.propertyName || 'Property'}</span>
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{unit.unitType}</td>
                      <td className="py-3 px-4 text-slate-600">{unit.floor !== null ? `Floor ${unit.floor}` : '-'}</td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        ₹{Number(unit.baseRentAmount).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={unit.occupancyStatus} />
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        {unit.activeTenancy ? (
                          <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {unit.activeTenancy.tenantName}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/units/${unit.id}`}>
                            <Button variant="ghost" size="sm" icon={<Eye className="h-3.5 w-3.5" />}>
                              View
                            </Button>
                          </Link>
                          <Link href={`/admin/units/${unit.id}/edit`}>
                            <Button variant="ghost" size="sm" icon={<Edit3 className="h-3.5 w-3.5" />}>
                              Edit
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center pt-2">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

