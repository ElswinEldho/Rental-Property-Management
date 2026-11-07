/**
 * Public API Boundary: Authentication Module
 */

export { authRouter } from './presentation/routes/authRoutes.js';
export { authenticate, ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from './presentation/middlewares/authenticate.js';
export { TokenService } from './application/services/TokenService.js';
export { PrismaAuthRepository } from './infrastructure/persistence/PrismaAuthRepository.js';
