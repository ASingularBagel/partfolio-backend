import express, { Express } from 'express';
import { Server } from './setupServer';
import dbConnection from './setupDB';
import { config } from './config';

class App {
  public init(): void {
    this.loadConfig(); // Verify env config
    dbConnection(); // Check database connection

    const app: Express = express();
    const server: Server = new Server(app);
    server.start();
  }

  private loadConfig() {
    config.validateConfig();
  }
}

const app: App = new App();
app.init();
