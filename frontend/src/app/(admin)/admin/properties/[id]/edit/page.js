'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { propertyService } from '@/services/propertyService';
import { useToast } from '@/providers/ToastProvider';
import { Heading, Paragraph } from '@/components/ui/typography';
import { TextInput } from '@/components/ui/inputs';
import { Button } from '@/components/ui/buttons';
import { Alert, LoadingState } from '@/components/ui/feedback';
import { FormField } from '@/components/forms';
import { Building, ArrowLeft, Save, Trash2 } from 'lucide-react';

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const propertyId = params?.id;

  const [formData, setFormData] = useState({
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: 'India',
    upiId: '',
    upiPayeeName: '',
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function loadProperty() {
      try {
        setInitialLoading(true);
        const res = await propertyService.getPropertyById(propertyId);
        const p = res.data;
        setFormData({
          name: p.name || '',
          addressLine1: p.addressLine1 || '',
          addressLine2: p.addressLine2 || '',
          city: p.city || '',
          stateProvince: p.stateProvince || '',
          postalCode: p.postalCode || '',
          country: p.country || 'India',
          upiId: p.upiId || '',
          upiPayeeName: p.upiPayeeName || '',
        });
      } catch (err) {
        setErrorMessage(err.message || 'Failed to load property.');
      } finally {
        setInitialLoading(false);
      }
    }

    if (propertyId) {
      loadProperty();
    }
  }, [propertyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Property name is required';
    if (!formData.addressLine1.trim()) errs.addressLine1 = 'Address line 1 is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.stateProvince.trim()) errs.stateProvince = 'State is required';
    if (!formData.postalCode.trim()) errs.postalCode = 'Postal code is required';
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

      await propertyService.updateProperty(propertyId, formData);

      showToast({
        title: 'Success',
        message: 'Property updated successfully.',
        type: 'success',
      });

      router.push(`/admin/properties/${propertyId}`);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update property.');
      showToast({
        title: 'Error',
        message: err.message || 'Failed to update property.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this property? This cannot be undone.')) {
      return;
    }

    try {
      setSaving(true);
      await propertyService.deleteProperty(propertyId);
      showToast({
        title: 'Success',
        message: 'Property deleted successfully.',
        type: 'success',
      });
      router.push('/admin/properties');
    } catch (err) {
      showToast({
        title: 'Deletion Blocked',
        message: err.message || 'Cannot delete property with active units or records.',
        type: 'error',
      });
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12">
        <LoadingState message="Loading property..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/admin/properties/${propertyId}`}>
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
              Back
            </Button>
          </Link>
          <div>
            <Heading level={1} className="text-xl font-bold text-slate-900">
              Edit Property
            </Heading>
            <Paragraph className="text-xs text-slate-500 mt-0.5">
              Update information for {formData.name || 'this property'}.
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
          Delete
        </Button>
      </div>

      {errorMessage && (
        <Alert variant="error" title="Error">
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Building className="h-4 w-4 text-brand-600" />
            General Information
          </h2>

          <div className="space-y-4">
            <FormField label="Property Name *" error={errors.name}>
              <TextInput
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
              />
            </FormField>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
            Address & Location
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FormField label="Address Line 1 *" error={errors.addressLine1}>
                <TextInput
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  error={!!errors.addressLine1}
                />
              </FormField>
            </div>

            <div className="sm:col-span-2">
              <FormField label="Address Line 2 (Optional)">
                <TextInput
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                />
              </FormField>
            </div>

            <FormField label="City *" error={errors.city}>
              <TextInput
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={!!errors.city}
              />
            </FormField>

            <FormField label="State / Province *" error={errors.stateProvince}>
              <TextInput
                name="stateProvince"
                value={formData.stateProvince}
                onChange={handleChange}
                error={!!errors.stateProvince}
              />
            </FormField>

            <FormField label="Postal Code *" error={errors.postalCode}>
              <TextInput
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                error={!!errors.postalCode}
              />
            </FormField>

            <FormField label="Country">
              <TextInput
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </FormField>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
            UPI Rent Collection Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="UPI ID (VPA)">
              <TextInput
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
              />
            </FormField>

            <FormField label="Payee Name">
              <TextInput
                name="upiPayeeName"
                value={formData.upiPayeeName}
                onChange={handleChange}
              />
            </FormField>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link href={`/admin/properties/${propertyId}`}>
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

