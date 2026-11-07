import { Router } from 'express';
import { PrismaAuthRepository } from '../../infrastructure/persistence/PrismaAuthRepository.js';
import { LoginUseCase } from '../../application/use-cases/LoginUseCase.js';
import { RefreshTokenUseCase } from '../../application/use-cases/RefreshTokenUseCase.js';
import { LogoutUseCase } from '../../application/use-cases/LogoutUseCase.js';
import { GetCurrentUserUseCase } from '../../application/use-cases/GetCurrentUserUseCase.js';
import { ChangePasswordUseCase } from '../../application/use-cases/ChangePasswordUseCase.js';
import { AuthController } from '../controllers/AuthController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateRequest } from '../../../../core/middleware/validate.js';
import { rateLimiter } from '../../../../core/middleware/rateLimiter.js';
import { config } from '../../../../core/config/index.js';
import { loginSchema, changePasswordSchema } from '../validators/authValidation.js';

// Dependency Injection Setup
const authRepository = new PrismaAuthRepository();
const loginUseCase = new LoginUseCase(authRepository);
const refreshTokenUseCase = new RefreshTokenUseCase(authRepository);
const logoutUseCase = new LogoutUseCase(authRepository);
const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);
const changePasswordUseCase = new ChangePasswordUseCase(authRepository);

const authController = new AuthController({
  loginUseCase,
  refreshTokenUseCase,
  logoutUseCase,
  getCurrentUserUseCase,
  changePasswordUseCase,
});

export const authRouter = Router();

// Login rate limiting: 10 attempts per minute in production, generous in test/dev
const loginRateLimiter = rateLimiter({
  windowMs: 60 * 1000,
  max: config.NODE_ENV === 'test' ? 100 : 10,
  message: 'Too many login attempts. Please wait a minute and try again.',
});

// Authentication Routes
authRouter.post('/login', loginRateLimiter, validateRequest({ body: loginSchema }), authController.login);
authRouter.post('/refresh', authController.refreshToken);
authRouter.post('/logout', authController.logout);

// Authenticated Routes
authRouter.get('/me', authenticate, authController.me);
authRouter.post('/change-password', authenticate, validateRequest({ body: changePasswordSchema }), authController.changePassword);

export default authRouter;
