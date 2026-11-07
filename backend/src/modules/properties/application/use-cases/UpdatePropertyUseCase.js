import { PropertyNotFoundError } from '../../domain/errors/PropertyErrors.js';

export class UpdatePropertyUseCase {
  constructor(propertyRepository) {
    this.propertyRepository = propertyRepository;
  }

  async execute(id, dto) {
    const existing = await this.propertyRepository.findById(id);
    if (!existing) {
      throw new PropertyNotFoundError(id);
    }
    return this.propertyRepository.update(id, dto);
  }
}

