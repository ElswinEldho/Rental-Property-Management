import { AppError } from '../../../../core/errors/AppError.js';

export class PropertyNotFoundError extends AppError {
  constructor(identifier = '') {
    super(
      `Property not found${identifier ? `: ${identifier}` : ''}.`,
      404,
      'PROPERTY_NOT_FOUND'
    );
  }
}

export class PropertyConflictError extends AppError {
  constructor(message = 'Property conflict detected.') {
    super(message, 409, 'PROPERTY_CONFLICT');
  }
}

export class PropertyValidationError extends AppError {
  constructor(message = 'Invalid property data.', details = null) {
    super(message, 400, 'PROPERTY_VALIDATION_ERROR', details);
  }
}

