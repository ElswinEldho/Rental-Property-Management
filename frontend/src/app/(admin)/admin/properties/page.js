'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { propertyService } from '@/services/propertyService';
import { useToast } from '@/providers/ToastProvider';
import { Heading, Paragraph } from '@/components/ui/typography';
import { Button } from '@/components/ui/buttons';
import { SearchInput } from '@/components/ui/inputs';
import { StatusBadge } from '@/components/ui/badges';
import { EmptyState, LoadingState, Alert } from '@/components/ui/feedback';
import { StatCard } from '@/components/ui/data-display';
import { Plus, Building, MapPin, Eye, Edit3, ArrowRight } from 'lucide-react';

export default function PropertiesListPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchData = async (search = '') => {
    try {
      setLoading(true);
      setErrorMessage('');

      const [listRes, statsRes] = await Promise.all([
        propertyService.listProperties({ search, limit: 50 }),
        propertyService.getPortfolioSummary().catch(() => ({ data: null })),
      ]);

      setProperties(listRes.data || []);
      if (statsRes?.data) {
        setStats(statsRes.data);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load properties.');
      showToast({ title: 'Error', message: 'Failed to load properties', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(searchQuery);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Heading level={1} className="text-2xl font-bold text-slate-900">
            Property Portfolio
          </Heading>
          <Paragraph className="text-sm text-slate-500 mt-1">
            Manage your buildings, residential complexes, and commercial properties.
          </Paragraph>
        </div>

        <Link href="/admin/properties/new">
          <Button variant="primary" icon={<Plus className="h-4 w-4" />}>
            Add Property
          </Button>
        </Link>
      </div>

      {/* Portfolio Statistics */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Properties"
            value={stats.totalProperties}
            icon={<Building className="h-5 w-5 text-brand-600" />}
          />
          <StatCard
            title="Total Units"
            value={stats.totalUnits}
            description={`${stats.occupiedUnits} occupied`}
          />
          <StatCard
            title="Vacant Units"
            value={stats.vacantUnits}
            description="Available for rent"
          />
          <StatCard
            title="Occupancy Rate"
            value={`${stats.occupancyRate}%`}
            trend={stats.occupancyRate >= 80 ? 'up' : 'neutral'}
          />
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="flex-1">
            <SearchInput
              placeholder="Search by property name, address, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <Alert variant="error" title="Error Loading Data">
          {errorMessage}
        </Alert>
      )}

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12">
          <LoadingState message="Loading properties..." />
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12">
          <EmptyState
            icon={<Building className="h-10 w-10 text-slate-400" />}
            title="No properties found"
            description={
              searchQuery
                ? `No properties matched "${searchQuery}". Try clearing the search filter.`
                : 'Get started by creating your first rental property in the system.'
            }
            action={
              <Link href="/admin/properties/new">
                <Button variant="primary" icon={<Plus className="h-4 w-4" />}>
                  Add Property
                </Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => {
            const summary = property.unitSummary || { total: 0, occupied: 0, vacant: 0 };
            return (
              <div
                key={property.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                        <Building className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 line-clamp-1">
                          {property.name}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="truncate">{property.city}, {property.stateProvince}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {property.addressLine1}
                    {property.addressLine2 ? `, ${property.addressLine2}` : ''}
                  </p>

                  <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <span className="block text-xs text-slate-500">Units</span>
                      <span className="text-sm font-semibold text-slate-900">{summary.total}</span>
                    </div>
                    <div className="bg-emerald-50 p-2 rounded-lg">
                      <span className="block text-xs text-emerald-600">Occupied</span>
                      <span className="text-sm font-semibold text-emerald-700">{summary.occupied}</span>
                    </div>
                    <div className="bg-amber-50 p-2 rounded-lg">
                      <span className="block text-xs text-amber-600">Vacant</span>
                      <span className="text-sm font-semibold text-amber-700">{summary.vacant}</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/admin/properties/${property.id}`}
                    className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    View Details
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <Link href={`/admin/properties/${property.id}/edit`}>
                    <Button variant="ghost" size="sm" icon={<Edit3 className="h-3.5 w-3.5" />}>
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

