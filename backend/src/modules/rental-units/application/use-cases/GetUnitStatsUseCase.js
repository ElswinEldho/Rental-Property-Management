export class GetUnitStatsUseCase {
  constructor(rentalUnitRepository) {
    this.rentalUnitRepository = rentalUnitRepository;
  }

  async execute(propertyId = null) {
    return this.rentalUnitRepository.getUnitStats(propertyId);
  }
}

