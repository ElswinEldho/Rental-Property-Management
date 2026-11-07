import {
  RentalUnitNotFoundError,
  UnitConflictError,
} from '../../domain/errors/RentalUnitErrors.js';

export class DeleteRentalUnitUseCase {
  constructor(rentalUnitRepository) {
    this.rentalUnitRepository = rentalUnitRepository;
  }

  async execute(id) {
    const existing = await this.rentalUnitRepository.findById(id);
    if (!existing) {
      throw new RentalUnitNotFoundError(id);
    }

    // Business rule: Do not physically delete units that have tenancy, billing, payment, meter-reading or other historical records.
    if (existing._count?.tenancyAgreements > 0) {
      throw new UnitConflictError(
        `Cannot delete unit '${existing.unitNumber}' because historical tenancy agreements exist. Please set the unit status to INACTIVE instead.`
      );
    }

    if (existing.electricityMeter) {
      throw new UnitConflictError(
        `Cannot delete unit '${existing.unitNumber}' because an electricity meter (${existing.electricityMeter.meterNumber}) is assigned. Remove or reassign the meter first.`
      );
    }

    return this.rentalUnitRepository.delete(id);
  }
}

