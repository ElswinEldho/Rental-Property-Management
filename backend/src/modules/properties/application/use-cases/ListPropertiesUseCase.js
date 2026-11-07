export class ListPropertiesUseCase {
  constructor(propertyRepository) {
    this.propertyRepository = propertyRepository;
  }

  async execute(params) {
    return this.propertyRepository.findMany(params);
  }
}

