import express, { Router } from 'express';
import { authMiddleware } from '@globals/helpers/auth-middleware';
import { CurrentUser } from '@auth/controllers/currentUser';

class CurrentUserRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/user', authMiddleware.checkAuthentication, CurrentUser.prototype.read);

    return this.router;
  }
}

export const currentUserRoute: CurrentUserRoutes = new CurrentUserRoutes();
