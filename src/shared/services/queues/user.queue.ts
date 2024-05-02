/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseQueue } from '@services/queues/base.queue';
import { userWorker } from '@workers/user.worker';

class UserQueue extends BaseQueue {
  constructor() {
    super('USER');
    this.processJob('adduser_userdb', 5, userWorker.addUser);
  }

  public addUserJob(name: string, data: any): void {
    this.addJob(name, data);
  }
}

export const userQueue: UserQueue = new UserQueue();
