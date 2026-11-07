import { z } from 'zod';

export const VALID_OCCUPANCY_STATUSES = ['VACANT', 'OCCUPIED', 'MAINTENANCE', 'INACTIVE'];

export const createRentalUnitSchema = z.object({
  propertyId: z.string().uuid('Invalid property ID format'),
  unitNumber: z.string().trim().min(1, 'Unit number is required').max(50),
  floor: z.coerce.number().int().optional().nullable(),
  unitType: z.string().trim().min(1, 'Unit type is required').max(50),
  baseRentAmount: z.coerce
    .number()
    .min(0, 'Monthly rent cannot be negative'),
  occupancyStatus: z
    .enum(VALID_OCCUPANCY_STATUSES, {
      errorMap: () => ({ message: 'Status must be VACANT, OCCUPIED, MAINTENANCE, or INACTIVE' }),
    })
    .default('VACANT'),
});

export const updateRentalUnitSchema = z.object({
  unitNumber: z.string().trim().min(1).max(50).optional(),
  floor: z.coerce.number().int().optional().nullable(),
  unitType: z.string().trim().min(1).max(50).optional(),
  baseRentAmount: z.coerce.number().min(0).optional(),
  occupancyStatus: z.enum(VALID_OCCUPANCY_STATUSES).optional(),
});

export const updateUnitStatusSchema = z.object({
  occupancyStatus: z.enum(VALID_OCCUPANCY_STATUSES, {
    errorMap: () => ({ message: 'Status must be VACANT, OCCUPIED, MAINTENANCE, or INACTIVE' }),
  }),
});

export const unitQuerySchema = z.object({
  propertyId: z.string().uuid().optional(),
  unitType: z.string().trim().optional(),
  occupancyStatus: z.enum(VALID_OCCUPANCY_STATUSES).optional(),
  search: z.string().trim().optional(),
  floor: z.coerce.number().int().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['unitNumber', 'floor', 'unitType', 'baseRentAmount', 'occupancyStatus', 'createdAt', 'propertyName']).default('unitNumber'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export const unitIdParamSchema = z.object({
  id: z.string().uuid('Invalid rental unit ID format'),
});

