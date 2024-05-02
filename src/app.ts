import dbConnection from '@root/setupDB';
import express, { Express } from 'express';
import { config } from '@root/config';
import { Server } from '@root/setupServer';

class App {
  public init(): void {
    this.loadConfig();
    dbConnection(); // Check database connection

    const app: Express = express();
    const server: Server = new Server(app);
    server.start();
  }

  private loadConfig() {
    config.validateConfig();
    config.cloudinaryConfig();
  }
}

const app: App = new App();
app.init();
