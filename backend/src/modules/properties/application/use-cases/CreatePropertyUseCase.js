export class CreatePropertyUseCase {
  constructor(propertyRepository) {
    this.propertyRepository = propertyRepository;
  }

  async execute(dto) {
    const property = await this.propertyRepository.create(dto);
    return property;
  }
}

