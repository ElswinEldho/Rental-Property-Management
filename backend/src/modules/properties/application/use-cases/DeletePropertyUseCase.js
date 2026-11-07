import { PropertyNotFoundError, PropertyConflictError } from '../../domain/errors/PropertyErrors.js';

export class DeletePropertyUseCase {
  constructor(propertyRepository) {
    this.propertyRepository = propertyRepository;
  }

  async execute(id) {
    const existing = await this.propertyRepository.findById(id);
    if (!existing) {
      throw new PropertyNotFoundError(id);
    }

    if (existing._count?.rentalUnits > 0) {
      throw new PropertyConflictError(
        'Cannot delete property that has active rental units. Remove or reassign units first.'
      );
    }

    return this.propertyRepository.delete(id);
  }
}

