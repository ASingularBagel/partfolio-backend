import { config } from './config';

import { createAdapter } from '@socket.io/redis-adapter';
import compression from 'compression';
import cookieSession from 'cookie-session';
import cors from 'cors';
import { Application, json, NextFunction, Request, Response, urlencoded } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import hpp from 'hpp';
import http from 'http';
import HTTP_STATUS from 'http-status-codes';
import { createClient } from 'redis';
import { Server as socketServer } from 'socket.io';
import routeMiddleware from './routes';
import { CustomError, IErrorResponse } from './shared/globals/helpers/error-handler';
import Logger from 'bunyan';

const log: Logger = config.createLogger('GLADOS:SETUP_SERVER'); // check back name for logger errors

export class Server {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routeMiddelware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        name: 'session',
        keys: [config.SECRET_KEY_1!, config.SECRET_KEY_2!],
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: config.NODE_ENV !== 'development'
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        optionsSuccessStatus: HTTP_STATUS.OK,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    );
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }

  private routeMiddelware(app: Application): void {
    routeMiddleware(app);
  }

  private globalErrorHandler(app: Application): void {
    // Catch all non existing endpoints
    app.all('*', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found.` });
    });

    app.use((error: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
      log.error(error);
      // If error already handled in globalErrors, return the globalError instead.
      if (error instanceof CustomError) return res.status(error.status_code).json(error.serializeErrors());
      next();
    });
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = http.createServer(app);
      const socketIO: socketServer = await this.createSocketIO(httpServer);
      this.startHttpServer(httpServer);
      this.socketIOConnections(socketIO);
    } catch (error) {
      log.error(error);
    }
  }

  private async createSocketIO(httpServer: http.Server): Promise<socketServer> {
    const io: socketServer = new socketServer(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      }
    });

    // Check documentation on this, very useful
    const pubClient = createClient({ url: config.REDIS_HOST });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  private startHttpServer(httpServer: http.Server): void {
    log.info(`Server has started with process ${process.pid}`);
    httpServer.listen(config.PORT!, () => {
      log.info(`Server is running on port ${config.PORT}`);
    });
  }

  private socketIOConnections(io: socketServer): void {}
}
