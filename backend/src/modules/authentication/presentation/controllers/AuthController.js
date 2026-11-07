import { setAuthCookie, clearAuthCookie } from '../../../../core/security/cookies.js';
import { successResponse } from '../../../../core/http/response.js';
import { config } from '../../../../core/config/index.js';
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from '../middlewares/authenticate.js';

export class AuthController {
  constructor({
    loginUseCase,
    refreshTokenUseCase,
    logoutUseCase,
    getCurrentUserUseCase,
    changePasswordUseCase,
  }) {
    this.loginUseCase = loginUseCase;
    this.refreshTokenUseCase = refreshTokenUseCase;
    this.logoutUseCase = logoutUseCase;
    this.getCurrentUserUseCase = getCurrentUserUseCase;
    this.changePasswordUseCase = changePasswordUseCase;
  }

  login = async (req, res, next) => {
    try {
      const { identifier, password } = req.body;
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await this.loginUseCase.execute({
        identifier,
        password,
        ipAddress,
        userAgent,
      });

      // 1. Set Access Token Cookie (15 mins)
      setAuthCookie(
        res,
        ACCESS_COOKIE_NAME,
        result.accessToken,
        config.ACCESS_TOKEN_EXPIRY_SECONDS * 1000
      );

      // 2. Set Refresh Token Cookie (7 days)
      setAuthCookie(
        res,
        REFRESH_COOKIE_NAME,
        result.refreshToken,
        config.REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
      );

      return successResponse(res, {
        data: { user: result.user },
        message: 'Login successful.',
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await this.refreshTokenUseCase.execute({
        rawRefreshToken,
        ipAddress,
        userAgent,
      });

      // Rotate cookies
      setAuthCookie(
        res,
        ACCESS_COOKIE_NAME,
        result.accessToken,
        config.ACCESS_TOKEN_EXPIRY_SECONDS * 1000
      );
      setAuthCookie(
        res,
        REFRESH_COOKIE_NAME,
        result.refreshToken,
        config.REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
      );

      return successResponse(res, {
        data: { user: result.user },
        message: 'Token refreshed successfully.',
      });
    } catch (error) {
      // Clear invalid cookies on refresh failure
      clearAuthCookie(res, ACCESS_COOKIE_NAME);
      clearAuthCookie(res, REFRESH_COOKIE_NAME);
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

      await this.logoutUseCase.execute({ rawRefreshToken });

      clearAuthCookie(res, ACCESS_COOKIE_NAME);
      clearAuthCookie(res, REFRESH_COOKIE_NAME);

      return successResponse(res, {
        message: 'Logged out successfully.',
      });
    } catch (error) {
      clearAuthCookie(res, ACCESS_COOKIE_NAME);
      clearAuthCookie(res, REFRESH_COOKIE_NAME);
      next(error);
    }
  };

  me = async (req, res, next) => {
    try {
      const user = await this.getCurrentUserUseCase.execute(req.user.id);

      return successResponse(res, {
        data: { user },
        message: 'User profile retrieved.',
      });
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;

      await this.changePasswordUseCase.execute({
        userId: req.user.id,
        currentPassword,
        newPassword,
      });

      // Revoking sessions requires clearing current client cookies
      clearAuthCookie(res, ACCESS_COOKIE_NAME);
      clearAuthCookie(res, REFRESH_COOKIE_NAME);

      return successResponse(res, {
        message: 'Password changed successfully. Please log in again with your new credentials.',
      });
    } catch (error) {
      next(error);
    }
  };
}

