import { RentalUnitNotFoundError } from '../../domain/errors/RentalUnitErrors.js';

export class GetRentalUnitByIdUseCase {
  constructor(rentalUnitRepository) {
    this.rentalUnitRepository = rentalUnitRepository;
  }

  async execute(id) {
    const unit = await this.rentalUnitRepository.findById(id);
    if (!unit) {
      throw new RentalUnitNotFoundError(id);
    }
    return unit;
  }
}

