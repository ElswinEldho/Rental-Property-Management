import { successResponse, paginatedResponse } from '../../../../core/http/response.js';

export class RentalUnitController {
  constructor({
    createRentalUnitUseCase,
    getRentalUnitByIdUseCase,
    listRentalUnitsUseCase,
    updateRentalUnitUseCase,
    updateUnitStatusUseCase,
    deleteRentalUnitUseCase,
    getUnitStatsUseCase,
  }) {
    this.createRentalUnitUseCase = createRentalUnitUseCase;
    this.getRentalUnitByIdUseCase = getRentalUnitByIdUseCase;
    this.listRentalUnitsUseCase = listRentalUnitsUseCase;
    this.updateRentalUnitUseCase = updateRentalUnitUseCase;
    this.updateUnitStatusUseCase = updateUnitStatusUseCase;
    this.deleteRentalUnitUseCase = deleteRentalUnitUseCase;
    this.getUnitStatsUseCase = getUnitStatsUseCase;

    this.create = this.create.bind(this);
    this.getById = this.getById.bind(this);
    this.list = this.list.bind(this);
    this.update = this.update.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.delete = this.delete.bind(this);
    this.getStats = this.getStats.bind(this);
  }

  async create(req, res, next) {
    try {
      const unit = await this.createRentalUnitUseCase.execute(req.body);
      return successResponse(res, {
        statusCode: 201,
        data: unit,
        message: 'Rental unit created successfully.',
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const unit = await this.getRentalUnitByIdUseCase.execute(req.params.id);
      return successResponse(res, {
        data: unit,
        message: 'Rental unit retrieved successfully.',
      });
    } catch (err) {
      next(err);
    }
  }

  async list(req, res, next) {
    try {
      const result = await this.listRentalUnitsUseCase.execute(req.query);
      return paginatedResponse(res, {
        data: result.items,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit) || 1,
        },
        message: 'Rental units retrieved successfully.',
      });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const unit = await this.updateRentalUnitUseCase.execute(req.params.id, req.body);
      return successResponse(res, {
        data: unit,
        message: 'Rental unit updated successfully.',
      });
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const unit = await this.updateUnitStatusUseCase.execute(
        req.params.id,
        req.body.occupancyStatus
      );
      return successResponse(res, {
        data: unit,
        message: 'Unit status updated successfully.',
      });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await this.deleteRentalUnitUseCase.execute(req.params.id);
      return successResponse(res, {
        data: null,
        message: 'Rental unit deleted successfully.',
      });
    } catch (err) {
      next(err);
    }
  }

  async getStats(req, res, next) {
    try {
      const propertyId = req.query.propertyId || null;
      const stats = await this.getUnitStatsUseCase.execute(propertyId);
      return successResponse(res, {
        data: stats,
        message: 'Rental unit statistics retrieved successfully.',
      });
    } catch (err) {
      next(err);
    }
  }
}

