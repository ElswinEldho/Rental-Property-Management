import { Router } from 'express';
import { authenticate } from '../../../authentication/presentation/middlewares/authenticate.js';
import { requireRoles } from '../../../../core/middleware/authGuard.js';
import { validateRequest } from '../../../../core/middleware/validate.js';
import {
  createRentalUnitSchema,
  updateRentalUnitSchema,
  updateUnitStatusSchema,
  unitQuerySchema,
  unitIdParamSchema,
} from '../validators/rentalUnitValidation.js';

export function createRentalUnitRouter(rentalUnitController) {
  const router = Router();

  // All endpoints require authentication and ADMIN or PROPERTY_MANAGER role
  router.use(authenticate);
  router.use(requireRoles('ADMIN', 'PROPERTY_MANAGER'));

  // Statistics
  router.get('/stats', rentalUnitController.getStats);

  // List units
  router.get(
    '/',
    validateRequest({ query: unitQuerySchema }),
    rentalUnitController.list
  );

  // Create unit
  router.post(
    '/',
    validateRequest({ body: createRentalUnitSchema }),
    rentalUnitController.create
  );

  // Get unit by ID
  router.get(
    '/:id',
    validateRequest({ params: unitIdParamSchema }),
    rentalUnitController.getById
  );

  // Update unit
  router.put(
    '/:id',
    validateRequest({ params: unitIdParamSchema, body: updateRentalUnitSchema }),
    rentalUnitController.update
  );

  // Update unit status specifically
  router.patch(
    '/:id/status',
    validateRequest({ params: unitIdParamSchema, body: updateUnitStatusSchema }),
    rentalUnitController.updateStatus
  );

  // Delete unit
  router.delete(
    '/:id',
    validateRequest({ params: unitIdParamSchema }),
    rentalUnitController.delete
  );

  return router;
}
