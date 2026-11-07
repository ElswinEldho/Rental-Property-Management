import { AppError } from '../../../../core/errors/AppError.js';

export class RentalUnitNotFoundError extends AppError {
  constructor(identifier = '') {
    super(
      `Rental unit not found${identifier ? `: ${identifier}` : ''}.`,
      404,
      'RENTAL_UNIT_NOT_FOUND'
    );
  }
}

export class DuplicateUnitNumberError extends AppError {
  constructor(unitNumber, propertyId) {
    super(
      `Unit '${unitNumber}' already exists under this property.`,
      409,
      'DUPLICATE_UNIT_NUMBER'
    );
  }
}

export class UnitConflictError extends AppError {
  constructor(message = 'Unit conflict detected.') {
    super(message, 409, 'UNIT_CONFLICT');
  }
}

export class InvalidUnitStatusTransitionError extends AppError {
  constructor(message = 'Invalid unit status transition.') {
    super(message, 400, 'INVALID_UNIT_STATUS_TRANSITION');
  }
}

export class UnitValidationError extends AppError {
  constructor(message = 'Invalid unit data.', details = null) {
    super(message, 400, 'UNIT_VALIDATION_ERROR', details);
  }
}

