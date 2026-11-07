import {
  RentalUnitNotFoundError,
  DuplicateUnitNumberError,
  InvalidUnitStatusTransitionError,
} from '../../domain/errors/RentalUnitErrors.js';

export class UpdateRentalUnitUseCase {
  constructor(rentalUnitRepository) {
    this.rentalUnitRepository = rentalUnitRepository;
  }

  async execute(id, dto) {
    const existing = await this.rentalUnitRepository.findById(id);
    if (!existing) {
      throw new RentalUnitNotFoundError(id);
    }

    // 1. If unitNumber is changing, verify uniqueness under the property
    if (dto.unitNumber && dto.unitNumber !== existing.unitNumber) {
      const duplicate = await this.rentalUnitRepository.findByPropertyAndUnitNumber(
        existing.propertyId,
        dto.unitNumber
      );
      if (duplicate && duplicate.id !== id) {
        throw new DuplicateUnitNumberError(dto.unitNumber, existing.propertyId);
      }
    }

    // 2. Validate occupancyStatus consistency with active tenancy
    if (dto.occupancyStatus && dto.occupancyStatus !== existing.occupancyStatus) {
      const activeTenancy = await this.rentalUnitRepository.getActiveTenancy(id);

      // Business Rule: Do not allow an occupied unit to be marked vacant manually while an active tenancy exists.
      if (activeTenancy && dto.occupancyStatus === 'VACANT') {
        throw new InvalidUnitStatusTransitionError(
          `Cannot mark unit '${existing.unitNumber}' as VACANT because an active tenancy agreement (${activeTenancy.agreementNumber}) exists.`
        );
      }

      // Business Rule: If an active tenancy exists, cannot manually switch to MAINTENANCE or INACTIVE without terminating the tenancy
      if (activeTenancy && (dto.occupancyStatus === 'MAINTENANCE' || dto.occupancyStatus === 'INACTIVE')) {
        throw new InvalidUnitStatusTransitionError(
          `Cannot mark unit '${existing.unitNumber}' as ${dto.occupancyStatus} while active tenancy agreement (${activeTenancy.agreementNumber}) exists.`
        );
      }
    }

    return this.rentalUnitRepository.update(id, dto);
  }
}

