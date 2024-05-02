import { config } from '@root/config';
import Logger from 'bunyan';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

const log: Logger = config.createLogger('LOGOUT_CONTROLLER');

export class Logout {
  public async update(req: Request, res: Response): Promise<void> {
    req.session = null;
    log.info('User logged out successfully');
    res.status(HTTP_STATUS.OK).json({ message: 'User logged out successfully.', user: {}, token: '' });
  }
}
