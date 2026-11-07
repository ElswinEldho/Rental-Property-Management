import { PrismaRentalUnitRepository } from './infrastructure/persistence/PrismaRentalUnitRepository.js';
import { propertyRepository } from '../properties/index.js';
import { CreateRentalUnitUseCase } from './application/use-cases/CreateRentalUnitUseCase.js';
import { GetRentalUnitByIdUseCase } from './application/use-cases/GetRentalUnitByIdUseCase.js';
import { ListRentalUnitsUseCase } from './application/use-cases/ListRentalUnitsUseCase.js';
import { UpdateRentalUnitUseCase } from './application/use-cases/UpdateRentalUnitUseCase.js';
import { UpdateUnitStatusUseCase } from './application/use-cases/UpdateUnitStatusUseCase.js';
import { DeleteRentalUnitUseCase } from './application/use-cases/DeleteRentalUnitUseCase.js';
import { GetUnitStatsUseCase } from './application/use-cases/GetUnitStatsUseCase.js';
import { RentalUnitController } from './presentation/controllers/RentalUnitController.js';
import { createRentalUnitRouter } from './presentation/routes/rentalUnitRoutes.js';

// Module Composition Root
const rentalUnitRepository = new PrismaRentalUnitRepository();

const createRentalUnitUseCase = new CreateRentalUnitUseCase({
  rentalUnitRepository,
  propertyRepository,
});
const getRentalUnitByIdUseCase = new GetRentalUnitByIdUseCase(rentalUnitRepository);
const listRentalUnitsUseCase = new ListRentalUnitsUseCase(rentalUnitRepository);
const updateRentalUnitUseCase = new UpdateRentalUnitUseCase(rentalUnitRepository);
const updateUnitStatusUseCase = new UpdateUnitStatusUseCase(rentalUnitRepository);
const deleteRentalUnitUseCase = new DeleteRentalUnitUseCase(rentalUnitRepository);
const getUnitStatsUseCase = new GetUnitStatsUseCase(rentalUnitRepository);

const rentalUnitController = new RentalUnitController({
  createRentalUnitUseCase,
  getRentalUnitByIdUseCase,
  listRentalUnitsUseCase,
  updateRentalUnitUseCase,
  updateUnitStatusUseCase,
  deleteRentalUnitUseCase,
  getUnitStatsUseCase,
});

export const rentalUnitRouter = createRentalUnitRouter(rentalUnitController);

// Export instances and use cases for internal cross-module usage
export {
  rentalUnitRepository,
  createRentalUnitUseCase,
  getRentalUnitByIdUseCase,
  listRentalUnitsUseCase,
  updateRentalUnitUseCase,
  updateUnitStatusUseCase,
  deleteRentalUnitUseCase,
  getUnitStatsUseCase,
  rentalUnitController,
};
