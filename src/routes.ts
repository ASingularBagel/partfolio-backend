import { Application } from 'express';
import { authMiddleware } from '@globals/helpers/auth-middleware';
import { authRoute } from '@auth/routes/authRoutes';
import { currentUserRoute } from '@auth/routes/currentRoutes';
import { serverAdapter } from '@services/queues/base.queue';

const BASE_PATH = '/api/v1';

export default (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter());
    app.use(BASE_PATH, authRoute.routes());
    app.use(BASE_PATH, authRoute.logoutRoute());

    app.use(BASE_PATH, authMiddleware.verifyToken, currentUserRoute.routes());
  };
  routes();
};
