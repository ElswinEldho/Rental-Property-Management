/**
 * @interface IRentalUnitRepository
 * Contract for rental unit persistence operations.
 */
export class IRentalUnitRepository {
  async create(data) {
    throw new Error('Method not implemented.');
  }

  async findById(id) {
    throw new Error('Method not implemented.');
  }

  async findByPropertyAndUnitNumber(propertyId, unitNumber) {
    throw new Error('Method not implemented.');
  }

  async findMany(params) {
    throw new Error('Method not implemented.');
  }

  async update(id, data) {
    throw new Error('Method not implemented.');
  }

  async delete(id) {
    throw new Error('Method not implemented.');
  }

  async getUnitStats(propertyId = null) {
    throw new Error('Method not implemented.');
  }

  async getActiveTenancy(unitId) {
    throw new Error('Method not implemented.');
  }
}

