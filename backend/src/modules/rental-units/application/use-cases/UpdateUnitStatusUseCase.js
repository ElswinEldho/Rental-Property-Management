import {
  RentalUnitNotFoundError,
  InvalidUnitStatusTransitionError,
} from '../../domain/errors/RentalUnitErrors.js';

export class UpdateUnitStatusUseCase {
  constructor(rentalUnitRepository) {
    this.rentalUnitRepository = rentalUnitRepository;
  }

  async execute(id, newStatus) {
    const existing = await this.rentalUnitRepository.findById(id);
    if (!existing) {
      throw new RentalUnitNotFoundError(id);
    }

    if (existing.occupancyStatus === newStatus) {
      return existing;
    }

    const activeTenancy = await this.rentalUnitRepository.getActiveTenancy(id);

    // Business rule: Do not allow an occupied unit to be marked vacant manually while an active tenancy exists.
    if (activeTenancy && newStatus === 'VACANT') {
      throw new InvalidUnitStatusTransitionError(
        `Cannot mark unit '${existing.unitNumber}' as VACANT because an active tenancy (${activeTenancy.agreementNumber}) is in effect.`
      );
    }

    // Business rule: Do not mark unit INACTIVE or MAINTENANCE if an active tenancy exists
    if (activeTenancy && (newStatus === 'INACTIVE' || newStatus === 'MAINTENANCE')) {
      throw new InvalidUnitStatusTransitionError(
        `Cannot change unit status to ${newStatus} while an active tenancy (${activeTenancy.agreementNumber}) exists.`
      );
    }

    return this.rentalUnitRepository.update(id, { occupancyStatus: newStatus });
  }
}

