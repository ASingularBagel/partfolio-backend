import { Request, Response } from 'express';
import { IUserDocument } from '@user/interfaces/user.interface';
import { userService } from '@services/db/user.service';
import { UserCache } from '@services/redis/user.cache';
import HTTP_STATUS from 'http-status-codes';
import Logger from 'bunyan';
import { config } from '@root/config';

const userCache: UserCache = new UserCache();
const log: Logger = config.createLogger('CURRENT_USER_CONTROLLER');

export class CurrentUser {
  public async read(req: Request, res: Response): Promise<void> {
    let isUser = false;
    let token = null;
    let user = null;

    // Check cache for user
    log.debug(`Checking cache for user with key: ${req.currentUser!._id}`);
    const cachedUser: IUserDocument = (await userCache.getUserFromCache(`${req.currentUser!._id}`)) as IUserDocument;

    // If user is not in cache, get user from DB
    const existingUser: IUserDocument = cachedUser ? cachedUser : await userService.getUserById(req.currentUser!._id);

    if (Object.keys(existingUser).length > 0) {
      isUser = true;
      token = req.session!.jwt;
      user = existingUser;
    }

    res.status(HTTP_STATUS.OK).json({ isUser, token, user });
  }
}
