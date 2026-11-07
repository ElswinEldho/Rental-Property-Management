import { successResponse, paginatedResponse } from '../../../../core/http/response.js';

export class PropertyController {
  constructor({
    createPropertyUseCase,
    getPropertyByIdUseCase,
    listPropertiesUseCase,
    updatePropertyUseCase,
    deletePropertyUseCase,
    getPortfolioSummaryUseCase,
  }) {
    this.createPropertyUseCase = createPropertyUseCase;
    this.getPropertyByIdUseCase = getPropertyByIdUseCase;
    this.listPropertiesUseCase = listPropertiesUseCase;
    this.updatePropertyUseCase = updatePropertyUseCase;
    this.deletePropertyUseCase = deletePropertyUseCase;
    this.getPortfolioSummaryUseCase = getPortfolioSummaryUseCase;

    this.create = this.create.bind(this);
    this.getById = this.getById.bind(this);
    this.list = this.list.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.getSummary = this.getSummary.bind(this);
  }

  async create(req, res, next) {
    try {
      const property = await this.createPropertyUseCase.execute(req.body);
      return successResponse(res, {
        statusCode: 201,
        data: property,
        message: 'Property created successfully.',
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const property = await this.getPropertyByIdUseCase.execute(req.params.id);
      return successResponse(res, {
        data: property,
        message: 'Property retrieved successfully.',
      });
    } catch (err) {
      next(err);
    }
  }

  async list(req, res, next) {
    try {
      const result = await this.listPropertiesUseCase.execute(req.query);
      return paginatedResponse(res, {
        data: result.items,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit) || 1,
        },
        message: 'Properties retrieved successfully.',
      });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const property = await this.updatePropertyUseCase.execute(req.params.id, req.body);
      return successResponse(res, {
        data: property,
        message: 'Property updated successfully.',
      });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await this.deletePropertyUseCase.execute(req.params.id);
      return successResponse(res, {
        data: null,
        message: 'Property deleted successfully.',
      });
    } catch (err) {
      next(err);
    }
  }

  async getSummary(req, res, next) {
    try {
      const summary = await this.getPortfolioSummaryUseCase.execute();
      return successResponse(res, {
        data: summary,
        message: 'Portfolio summary retrieved successfully.',
      });
    } catch (err) {
      next(err);
    }
  }
}
