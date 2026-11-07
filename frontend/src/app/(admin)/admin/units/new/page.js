'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { rentalUnitService } from '@/services/rentalUnitService';
import { propertyService } from '@/services/propertyService';
import { useToast } from '@/providers/ToastProvider';
import { Heading, Paragraph } from '@/components/ui/typography';
import { TextInput, NumberInput } from '@/components/ui/inputs';
import { Button } from '@/components/ui/buttons';
import { Alert } from '@/components/ui/feedback';
import { FormField } from '@/components/forms';
import { DoorOpen, ArrowLeft, Save } from 'lucide-react';

export default function CreateRentalUnitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultPropertyId = searchParams.get('propertyId') || '';

  const { showToast } = useToast();

  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({
    propertyId: defaultPropertyId,
    unitNumber: '',
    unitType: '1BHK',
    floor: '',
    baseRentAmount: '',
    occupancyStatus: 'VACANT',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function loadProperties() {
      try {
        const res = await propertyService.listProperties({ limit: 100 });
        setProperties(res.data || []);
        if (!formData.propertyId && res.data?.length > 0) {
          setFormData((prev) => ({ ...prev, propertyId: res.data[0].id }));
        }
      } catch (err) {
        showToast({ title: 'Error', message: 'Failed to load properties', type: 'error' });
      }
    }
    loadProperties();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.propertyId) errs.propertyId = 'Property is required';
    if (!formData.unitNumber.trim()) errs.unitNumber = 'Unit number is required';
    if (!formData.unitType.trim()) errs.unitType = 'Unit type is required';
    if (formData.baseRentAmount === '' || Number(formData.baseRentAmount) < 0) {
      errs.baseRentAmount = 'Valid monthly rent is required (≥ 0)';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      await rentalUnitService.createUnit({
        propertyId: formData.propertyId,
        unitNumber: formData.unitNumber.trim(),
        unitType: formData.unitType.trim(),
        floor: formData.floor !== '' ? Number(formData.floor) : null,
        baseRentAmount: Number(formData.baseRentAmount),
        occupancyStatus: formData.occupancyStatus,
      });

      showToast({
        title: 'Success',
        message: 'Rental unit created successfully.',
        type: 'success',
      });

      router.push(`/admin/units?propertyId=${formData.propertyId}`);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create rental unit.');
      showToast({
        title: 'Error',
        message: err.message || 'Failed to create unit.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/units">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
        </Link>
        <div>
          <Heading level={1} className="text-xl font-bold text-slate-900">
            Add Rental Unit
          </Heading>
          <Paragraph className="text-xs text-slate-500 mt-0.5">
            Register an apartment, room, or commercial unit under a property.
          </Paragraph>
        </div>
      </div>

      {errorMessage && (
        <Alert variant="error" title="Submission Error">
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <DoorOpen className="h-4 w-4 text-brand-600" />
            Unit Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FormField label="Assigned Property *" error={errors.propertyId}>
                <select
                  name="propertyId"
                  value={formData.propertyId}
                  onChange={handleChange}
                  className="w-full text-sm rounded-lg border border-slate-300 py-2 px-3 focus:border-brand-500 focus:outline-none bg-white"
                >
                  <option value="">Select Property...</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.city})
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField label="Unit Number / Name *" error={errors.unitNumber} helper="e.g. 101, Flat 3B, Godown A">
              <TextInput
                name="unitNumber"
                placeholder="e.g. 101"
                value={formData.unitNumber}
                onChange={handleChange}
                error={!!errors.unitNumber}
              />
            </FormField>

            <FormField label="Unit Type *" error={errors.unitType}>
              <select
                name="unitType"
                value={formData.unitType}
                onChange={handleChange}
                className="w-full text-sm rounded-lg border border-slate-300 py-2 px-3 focus:border-brand-500 focus:outline-none bg-white"
              >
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
                <option value="RK">RK</option>
                <option value="Single Room">Single Room</option>
                <option value="Godown">Godown</option>
                <option value="Independent House">Independent House</option>
                <option value="Commercial Kitchen">Commercial Kitchen</option>
                <option value="Laundry Godown">Laundry Godown</option>
              </select>
            </FormField>

            <FormField label="Floor Number" helper="Optional (leave empty for ground/independent)">
              <TextInput
                type="number"
                name="floor"
                placeholder="e.g. 1, 2"
                value={formData.floor}
                onChange={handleChange}
              />
            </FormField>

            <FormField label="Initial Availability Status">
              <select
                name="occupancyStatus"
                value={formData.occupancyStatus}
                onChange={handleChange}
                className="w-full text-sm rounded-lg border border-slate-300 py-2 px-3 focus:border-brand-500 focus:outline-none bg-white"
              >
                <option value="VACANT">Vacant</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </FormField>
          </div>
        </div>

        {/* Pricing */}
        <div>
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
            Financial Baseline
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Monthly Base Rent (₹) *" error={errors.baseRentAmount} helper="Base monthly rental rate in INR">
              <TextInput
                type="number"
                step="0.01"
                name="baseRentAmount"
                placeholder="e.g. 12000"
                value={formData.baseRentAmount}
                onChange={handleChange}
                error={!!errors.baseRentAmount}
              />
            </FormField>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link href="/admin/units">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={<Save className="h-4 w-4" />}
          >
            Create Unit
          </Button>
        </div>
      </form>
    </div>
  );
}

