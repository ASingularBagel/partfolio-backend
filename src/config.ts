import dotenv from 'dotenv';
dotenv.config({});
import bunyan from 'bunyan';

class Config {
  public PORT: string | number | undefined;
  public DB_URI: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_KEY_1: string | undefined;
  public SECRET_KEY_2: string | undefined;
  public CLIENT_URL: string | undefined;
  public REDIS_HOST: string | undefined;

  constructor() {
    this.PORT = process.env.PORT || 5001;
    this.DB_URI = process.env.DB_URI || '';
    this.JWT_TOKEN = process.env.JWT_TOKEN || '';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.SECRET_KEY_1 = process.env.SECRET_KEY_1 || '';
    this.SECRET_KEY_2 = process.env.SECRET_KEY_2 || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.REDIS_HOST = process.env.REDIS_HOST || 'http://localhost:6379';
  }

  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: 'debug' });
  }

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) throw new Error(`Configuration for ${key} returned undefined.`);
    }
  }
}

export const config: Config = new Config();
