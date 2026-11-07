export class GetPortfolioSummaryUseCase {
  constructor(propertyRepository) {
    this.propertyRepository = propertyRepository;
  }

  async execute() {
    return this.propertyRepository.getPortfolioStats();
  }
}

