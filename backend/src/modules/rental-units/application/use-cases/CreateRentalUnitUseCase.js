import { DuplicateUnitNumberError } from '../../domain/errors/RentalUnitErrors.js';
import { PropertyNotFoundError } from '../../../properties/domain/errors/PropertyErrors.js';

export class CreateRentalUnitUseCase {
  constructor({ rentalUnitRepository, propertyRepository }) {
    this.rentalUnitRepository = rentalUnitRepository;
    this.propertyRepository = propertyRepository;
  }

  async execute(dto) {
    // 1. Verify that parent property exists
    const property = await this.propertyRepository.findById(dto.propertyId);
    if (!property) {
      throw new PropertyNotFoundError(dto.propertyId);
    }

    // 2. Verify that unitNumber is unique within property
    const existingUnit = await this.rentalUnitRepository.findByPropertyAndUnitNumber(
      dto.propertyId,
      dto.unitNumber
    );
    if (existingUnit) {
      throw new DuplicateUnitNumberError(dto.unitNumber, dto.propertyId);
    }

    // 3. Create unit
    return this.rentalUnitRepository.create(dto);
  }
}
