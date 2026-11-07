import { z } from 'zod';

export const createPropertySchema = z.object({
  name: z.string().trim().min(2, 'Property name must be at least 2 characters').max(200),
  addressLine1: z.string().trim().min(3, 'Address line 1 is required').max(255),
  addressLine2: z.string().trim().max(255).optional().nullable(),
  city: z.string().trim().min(2, 'City is required').max(100),
  stateProvince: z.string().trim().min(2, 'State / Province is required').max(100),
  postalCode: z.string().trim().min(3, 'Postal code is required').max(30),
  country: z.string().trim().max(100).default('India'),
  upiId: z.string().trim().max(100).optional().nullable(),
  upiPayeeName: z.string().trim().max(150).optional().nullable(),
});

export const updatePropertySchema = z.object({
  name: z.string().trim().min(2).max(200).optional(),
  addressLine1: z.string().trim().min(3).max(255).optional(),
  addressLine2: z.string().trim().max(255).optional().nullable(),
  city: z.string().trim().min(2).max(100).optional(),
  stateProvince: z.string().trim().min(2).max(100).optional(),
  postalCode: z.string().trim().min(3).max(30).optional(),
  country: z.string().trim().max(100).optional(),
  upiId: z.string().trim().max(100).optional().nullable(),
  upiPayeeName: z.string().trim().max(150).optional().nullable(),
});

export const propertyQuerySchema = z.object({
  search: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['name', 'city', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const propertyIdParamSchema = z.object({
  id: z.string().uuid('Invalid property ID format'),
});

