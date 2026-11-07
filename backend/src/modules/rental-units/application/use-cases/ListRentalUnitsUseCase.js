export class ListRentalUnitsUseCase {
  constructor(rentalUnitRepository) {
    this.rentalUnitRepository = rentalUnitRepository;
  }

  async execute(params) {
    return this.rentalUnitRepository.findMany(params);
  }
}

