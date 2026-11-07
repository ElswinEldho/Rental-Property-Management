'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { propertyService } from '@/services/propertyService';
import { useToast } from '@/providers/ToastProvider';
import { Heading, Paragraph } from '@/components/ui/typography';
import { TextInput } from '@/components/ui/inputs';
import { Button } from '@/components/ui/buttons';
import { Alert } from '@/components/ui/feedback';
import { FormField } from '@/components/forms';
import { Building, ArrowLeft, Save } from 'lucide-react';

export default function CreatePropertyPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: 'Kochi',
    stateProvince: 'Kerala',
    postalCode: '',
    country: 'India',
    upiId: '',
    upiPayeeName: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});

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
      setLoading(true);
      setErrorMessage('');

      await propertyService.createProperty(formData);

      showToast({
        title: 'Success',
        message: 'Property created successfully.',
        type: 'success',
      });

      router.push('/admin/properties');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create property.');
      showToast({
        title: 'Error',
        message: err.message || 'Failed to create property.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/properties">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
        </Link>
        <div>
          <Heading level={1} className="text-xl font-bold text-slate-900">
            Add New Property
          </Heading>
          <Paragraph className="text-xs text-slate-500 mt-0.5">
            Register a new building or property in your management portfolio.
          </Paragraph>
        </div>
      </div>

      {errorMessage && (
        <Alert variant="error" title="Submission Error">
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        {/* Basic Details */}
        <div>
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Building className="h-4 w-4 text-brand-600" />
            General Information
          </h2>

          <div className="space-y-4">
            <FormField label="Property Name *" error={errors.name} helper="Example: Flat 1, Lakeview Residency">
              <TextInput
                name="name"
                placeholder="e.g. Sunrise Apartments"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
              />
            </FormField>
          </div>
        </div>

        {/* Address */}
        <div>
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
            Address & Location
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FormField label="Address Line 1 *" error={errors.addressLine1}>
                <TextInput
                  name="addressLine1"
                  placeholder="Street address, building number"
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
                  placeholder="Apartment, suite, landmark"
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
                placeholder="e.g. 682001"
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

        {/* Payment Configuration */}
        <div>
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
            UPI Rent Collection Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="UPI ID (VPA)" helper="Default UPI VPA for receiving rent payments">
              <TextInput
                name="upiId"
                placeholder="e.g. rental.owner@okaxis"
                value={formData.upiId}
                onChange={handleChange}
              />
            </FormField>

            <FormField label="Payee Name" helper="Beneficiary name displayed on UPI app">
              <TextInput
                name="upiPayeeName"
                placeholder="e.g. John Doe Rentals"
                value={formData.upiPayeeName}
                onChange={handleChange}
              />
            </FormField>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link href="/admin/properties">
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
            Create Property
          </Button>
        </div>
      </form>
    </div>
  );
}

