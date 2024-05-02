import { Request, Response, NextFunction } from 'express';
import { config } from '@root/config';
import JWT from 'jsonwebtoken';
import { AuthPayload } from '@auth/interfaces/auth.interface';
import { UnauthorizedError } from '@globals/helpers/error-handler';
import Logger from 'bunyan';

const log: Logger = config.createLogger('AUTH_MIDDLEWARE');
export class AuthMiddleware {
  public async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.session?.jwt;

    if (!token) {
      throw new UnauthorizedError('No token provided.', [{ message: 'No token provided.', field: 'token' }]);
    }

    try {
      const decoded = JWT.verify(token, config.JWT_TOKEN as string);
      log.debug(`Decoded token: ${JSON.stringify(decoded)}`);
      req.currentUser = decoded as AuthPayload;
      next();
    } catch (error) {
      throw new UnauthorizedError('Invalid token.', [{ message: 'Invalid token.', field: 'token' }]);
    }
  }

  public async verifyAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.currentUser?.role !== 'admin') {
      throw new UnauthorizedError('Unauthorized.', [{ message: 'Unauthorized.', field: 'role' }]);
    }
    next();
  }

  public async checkAuthentication(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.currentUser) {
      throw new UnauthorizedError('Unauthorized.', [{ message: 'Unauthorized.', field: 'user' }]);
    }
    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
