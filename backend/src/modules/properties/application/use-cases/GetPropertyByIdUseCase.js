import { PropertyNotFoundError } from '../../domain/errors/PropertyErrors.js';

export class GetPropertyByIdUseCase {
  constructor(propertyRepository) {
    this.propertyRepository = propertyRepository;
  }

  async execute(id) {
    const property = await this.propertyRepository.findById(id);
    if (!property) {
      throw new PropertyNotFoundError(id);
    }
    return property;
  }
}

