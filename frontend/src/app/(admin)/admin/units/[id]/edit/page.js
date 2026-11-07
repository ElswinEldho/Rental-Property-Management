'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { rentalUnitService } from '@/services/rentalUnitService';
import { useToast } from '@/providers/ToastProvider';
import { Heading, Paragraph } from '@/components/ui/typography';
import { TextInput } from '@/components/ui/inputs';
import { Button } from '@/components/ui/buttons';
import { Alert, LoadingState } from '@/components/ui/feedback';
import { FormField } from '@/components/forms';
import { DoorOpen, ArrowLeft, Save, Trash2 } from 'lucide-react';

export default function EditRentalUnitPage() {
  const params = useParams();
  const unitId = params?.id;
  const router = useRouter();
  const { showToast } = useToast();

  const [unit, setUnit] = useState(null);
  const [formData, setFormData] = useState({
    unitNumber: '',
    unitType: '1BHK',
    floor: '',
    baseRentAmount: '',
    occupancyStatus: 'VACANT',
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function loadUnit() {
      try {
        setInitialLoading(true);
        const res = await rentalUnitService.getUnitById(unitId);
        const u = res.data;
        setUnit(u);
        setFormData({
          unitNumber: u.unitNumber || '',
          unitType: u.unitType || '1BHK',
          floor: u.floor !== null && u.floor !== undefined ? u.floor.toString() : '',
          baseRentAmount: u.baseRentAmount !== undefined ? u.baseRentAmount.toString() : '',
          occupancyStatus: u.occupancyStatus || 'VACANT',
        });
      } catch (err) {
        setErrorMessage(err.message || 'Failed to load rental unit.');
      } finally {
        setInitialLoading(false);
      }
    }

    if (unitId) {
      loadUnit();
    }
  }, [unitId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
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
      setSaving(true);
      setErrorMessage('');

      await rentalUnitService.updateUnit(unitId, {
        unitNumber: formData.unitNumber.trim(),
        unitType: formData.unitType.trim(),
        floor: formData.floor !== '' ? Number(formData.floor) : null,
        baseRentAmount: Number(formData.baseRentAmount),
        occupancyStatus: formData.occupancyStatus,
      });

      showToast({
        title: 'Success',
        message: 'Rental unit updated successfully.',
        type: 'success',
      });

      router.push(`/admin/units/${unitId}`);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update rental unit.');
      showToast({
        title: 'Error',
        message: err.message || 'Failed to update unit.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this rental unit? This action cannot be undone.')) {
      return;
    }

    try {
      setSaving(true);
      await rentalUnitService.deleteUnit(unitId);
      showToast({
        title: 'Success',
        message: 'Rental unit deleted successfully.',
        type: 'success',
      });
      router.push(`/admin/units?propertyId=${unit?.propertyId || ''}`);
    } catch (err) {
      showToast({
        title: 'Deletion Prevented',
        message: err.message || 'Cannot delete unit with existing tenancy agreements or meter associations.',
        type: 'error',
      });
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12">
        <LoadingState message="Loading unit..." />
      </div>
    );
  }

  const hasActiveTenancy = unit?.tenancyAgreements?.length > 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/admin/units/${unitId}`}>
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
              Back
            </Button>
          </Link>
          <div>
            <Heading level={1} className="text-xl font-bold text-slate-900">
              Edit Unit {formData.unitNumber}
            </Heading>
            <Paragraph className="text-xs text-slate-500 mt-0.5">
              Property: {unit?.property?.name}
            </Paragraph>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDelete}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          icon={<Trash2 className="h-4 w-4" />}
        >
          Delete Unit
        </Button>
      </div>

      {errorMessage && (
        <Alert variant="error" title="Update Error">
          {errorMessage}
        </Alert>
      )}

      {hasActiveTenancy && (
        <Alert
          variant="warning"
          title="Active Tenancy in Progress"
        >
          An active tenancy agreement is linked to this unit. The unit status cannot be manually marked VACANT, MAINTENANCE, or INACTIVE while the agreement is ongoing.
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <DoorOpen className="h-4 w-4 text-brand-600" />
            Unit Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Unit Number / Name *" error={errors.unitNumber}>
              <TextInput
                name="unitNumber"
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

            <FormField label="Floor Number">
              <TextInput
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
              />
            </FormField>

            <FormField
              label="Availability Status"
              helper={hasActiveTenancy ? 'Locked due to active tenancy' : 'Change current occupancy status'}
            >
              <select
                name="occupancyStatus"
                value={formData.occupancyStatus}
                onChange={handleChange}
                disabled={hasActiveTenancy}
                className="w-full text-sm rounded-lg border border-slate-300 py-2 px-3 focus:border-brand-500 focus:outline-none bg-white disabled:bg-slate-100 disabled:text-slate-500 cursor-pointer disabled:cursor-not-allowed"
              >
                <option value="VACANT">Vacant</option>
                <option value="OCCUPIED">Occupied</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </FormField>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
            Financial Baseline
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Monthly Base Rent (₹) *" error={errors.baseRentAmount}>
              <TextInput
                type="number"
                step="0.01"
                name="baseRentAmount"
                value={formData.baseRentAmount}
                onChange={handleChange}
                error={!!errors.baseRentAmount}
              />
            </FormField>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link href={`/admin/units/${unitId}`}>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            icon={<Save className="h-4 w-4" />}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

