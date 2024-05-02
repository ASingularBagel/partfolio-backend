import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { userService } from '@services/db/user.service';

const log: Logger = config.createLogger('USER_WORKER');

class UserWorker {
  public async addUser(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;
      log.info('Adding user document...');
      await userService.createUser(value);
      job.progress(100);
      done(null, job.data);
      log.info('Completed job !');
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}

export const userWorker: UserWorker = new UserWorker();
