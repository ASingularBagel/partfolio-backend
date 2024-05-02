import express, { Router } from 'express';
import { Signup } from '@auth/controllers/signup';
import { LoginEmail } from '@auth/controllers/loginEmail';
import { LoginUsername } from '@auth/controllers/loginUsername';
import { Logout } from './../controllers/logout';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/signup', Signup.prototype.create);
    this.router.post('/login&mode=email', LoginEmail.prototype.read);
    this.router.post('/login&mode=username', LoginUsername.prototype.read);

    return this.router;
  }

  public logoutRoute(): Router {
    this.router.get('/logout', Logout.prototype.update);

    return this.router;
  }
}

export const authRoute: AuthRoutes = new AuthRoutes();
