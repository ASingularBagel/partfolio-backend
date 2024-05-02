import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { authService } from '@services/db/auth.service';

const log: Logger = config.createLogger('AUTH_WORKER');

class AuthWorker {
  public async addUserAuth(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;
      log.info('Adding auth...');
      await authService.addUserToDb(value);
      job.progress(100);
      done(null, job.data);
      log.info('Completed job !');
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}

export const authWorker: AuthWorker = new AuthWorker();
