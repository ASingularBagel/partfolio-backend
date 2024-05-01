import mongoose from 'mongoose';
import { config } from './config';
import Logger from 'bunyan';

const log: Logger = config.createLogger('GLADOS:SETUP_DB');

export default () => {
  const connect = () => {
    mongoose
      .connect(`${config.DB_URI}`)
      .then(() => {
        log.info('Successfully connected to database.');
      })
      .catch((error: Error) => {
        log.error(error);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on('disconnected', connect);
};
