/**
 * @interface IPropertyRepository
 * Contract for property persistence operations.
 */
export class IPropertyRepository {
  async create(data) {
    throw new Error('Method not implemented.');
  }

  async findById(id) {
    throw new Error('Method not implemented.');
  }

  async findMany(params) {
    throw new Error('Method not implemented.');
  }

  async count(params) {
    throw new Error('Method not implemented.');
  }

  async update(id, data) {
    throw new Error('Method not implemented.');
  }

  async delete(id) {
    throw new Error('Method not implemented.');
  }

  async getUnitCounts(propertyId) {
    throw new Error('Method not implemented.');
  }

  async getPortfolioStats() {
    throw new Error('Method not implemented.');
  }
}

