import { PrismaPropertyRepository } from './infrastructure/persistence/PrismaPropertyRepository.js';
import { CreatePropertyUseCase } from './application/use-cases/CreatePropertyUseCase.js';
import { GetPropertyByIdUseCase } from './application/use-cases/GetPropertyByIdUseCase.js';
import { ListPropertiesUseCase } from './application/use-cases/ListPropertiesUseCase.js';
import { UpdatePropertyUseCase } from './application/use-cases/UpdatePropertyUseCase.js';
import { DeletePropertyUseCase } from './application/use-cases/DeletePropertyUseCase.js';
import { GetPortfolioSummaryUseCase } from './application/use-cases/GetPortfolioSummaryUseCase.js';
import { PropertyController } from './presentation/controllers/PropertyController.js';
import { createPropertyRouter } from './presentation/routes/propertyRoutes.js';

// Module Composition Root
const propertyRepository = new PrismaPropertyRepository();

const createPropertyUseCase = new CreatePropertyUseCase(propertyRepository);
const getPropertyByIdUseCase = new GetPropertyByIdUseCase(propertyRepository);
const listPropertiesUseCase = new ListPropertiesUseCase(propertyRepository);
const updatePropertyUseCase = new UpdatePropertyUseCase(propertyRepository);
const deletePropertyUseCase = new DeletePropertyUseCase(propertyRepository);
const getPortfolioSummaryUseCase = new GetPortfolioSummaryUseCase(propertyRepository);

const propertyController = new PropertyController({
  createPropertyUseCase,
  getPropertyByIdUseCase,
  listPropertiesUseCase,
  updatePropertyUseCase,
  deletePropertyUseCase,
  getPortfolioSummaryUseCase,
});

export const propertyRouter = createPropertyRouter(propertyController);

// Export instances and classes for internal cross-module usage or testing
export {
  propertyRepository,
  createPropertyUseCase,
  getPropertyByIdUseCase,
  listPropertiesUseCase,
  updatePropertyUseCase,
  deletePropertyUseCase,
  getPortfolioSummaryUseCase,
  propertyController,
};
