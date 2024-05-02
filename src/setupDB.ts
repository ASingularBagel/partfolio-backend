import Logger from 'bunyan';
import mongoose from 'mongoose';
import { config } from '@root/config';
import { redisConnection } from '@services/redis/redis.connection';

const log: Logger = config.createLogger('SETUP_DB');

export default () => {
  const connect = () => {
    mongoose
      .connect(`${config.DB_URI}`)
      .then(() => {
        log.info('Successfully connected to database.');
        redisConnection.connect();
      })
      .catch((error: Error) => {
        log.error(error);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on('disconnected', connect);
};
