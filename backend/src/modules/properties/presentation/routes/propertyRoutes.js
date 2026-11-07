import { Router } from 'express';
import { authenticate } from '../../../authentication/presentation/middlewares/authenticate.js';
import { requireRoles } from '../../../../core/middleware/authGuard.js';
import { validateRequest } from '../../../../core/middleware/validate.js';
import {
  createPropertySchema,
  updatePropertySchema,
  propertyQuerySchema,
  propertyIdParamSchema,
} from '../validators/propertyValidation.js';

export function createPropertyRouter(propertyController) {
  const router = Router();

  // All property management endpoints require authentication and ADMIN or PROPERTY_MANAGER role
  router.use(authenticate);
  router.use(requireRoles('ADMIN', 'PROPERTY_MANAGER'));

  // Summary / Portfolio analytics
  router.get('/summary', propertyController.getSummary);

  // List properties with filters and pagination
  router.get(
    '/',
    validateRequest({ query: propertyQuerySchema }),
    propertyController.list
  );

  // Create property
  router.post(
    '/',
    validateRequest({ body: createPropertySchema }),
    propertyController.create
  );

  // Get property by ID
  router.get(
    '/:id',
    validateRequest({ params: propertyIdParamSchema }),
    propertyController.getById
  );

  // Update property
  router.put(
    '/:id',
    validateRequest({ params: propertyIdParamSchema, body: updatePropertySchema }),
    propertyController.update
  );

  // Delete property
  router.delete(
    '/:id',
    validateRequest({ params: propertyIdParamSchema }),
    propertyController.delete
  );

  return router;
}
