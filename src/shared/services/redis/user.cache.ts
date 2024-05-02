import { ServerError } from '@globals/helpers/error-handler';
import { Helpers } from '@globals/helpers/helpers';
import { config } from '@root/config';
import { BaseCache } from '@services/redis/base.cache';
import { IUserDocument } from '@user/interfaces/user.interface';
import Logger from 'bunyan';

const log: Logger = config.createLogger('USER_CACHE');

export class UserCache extends BaseCache {
  constructor() {
    super('userCache');
  }

  public async saveUserToCache(key: string, userId: string, createdUser: IUserDocument): Promise<void> {
    const createdAt = new Date();
    const {
      _id,
      uId,
      username,
      email,
      blocked,
      blockedBy,
      postsCount,
      profilePicture,
      followersCount,
      followingCount,
      notifications,
      location,
      bgImageId,
      bgImageVersion,
      social
    } = createdUser;

    const userInfo: string[] = [
      '_id',
      `${_id}`,
      'uId',
      `${uId}`,
      'username',
      `${username}`,
      'email',
      `${email}`,
      'createdAt',
      `${createdAt}`,
      'postsCount',
      `${postsCount}`
    ];

    const socialInfo: string[] = [
      'blocked',
      JSON.stringify(blocked),
      'blockedBy',
      JSON.stringify(blockedBy),
      'profilePicture',
      `${profilePicture}`,
      'bgImageId',
      `${bgImageId}`,
      'bgImageVersion',
      `${bgImageVersion}`,
      'followersCount',
      `${followersCount}`,
      'followingCount',
      `${followingCount}`,
      'notifications',
      JSON.stringify(notifications),
      'social',
      JSON.stringify(social)
    ];

    const extraInfo: string[] = ['location', `${location}`];

    const dataToSave: string[] = [...userInfo, ...socialInfo, ...extraInfo];

    try {
      log.info('Attempting to save user data...');
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      await this.client.ZADD('user', { score: parseInt(userId, 10), value: `${key}` });
      await this.client.HSET(`users:${key}`, dataToSave);
      log.info('Succesfully saved user data !');
    } catch (error) {
      log.error(error);
      throw new ServerError('Something went wrong :(', [{ message: 'Failed to save to userCache.', field: 'Server' }]);
    }
  }

  public async getUserFromCache(key: string): Promise<IUserDocument | null> {
    try {
      log.info('Attempting to get user data...');
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      const user: IUserDocument = (await this.client.HGETALL(`users:${key}`)) as unknown as IUserDocument;
      log.info('Succesfully got user data !');
      user.createdAt = new Date(Helpers.parseJSON(`${user.createdAt}`));
      user.blocked = Helpers.parseJSON(`${user.blocked}`);
      user.blockedBy = Helpers.parseJSON(`${user.blockedBy}`);
      user.notifications = Helpers.parseJSON(`${user.notifications}`);
      user.social = Helpers.parseJSON(`${user.social}`);
      user.followersCount = parseInt(`${user.followersCount}`, 10);
      user.followingCount = parseInt(`${user.followingCount}`, 10);
      user.postsCount = parseInt(`${user.postsCount}`, 10);

      return user;
    } catch (error) {
      log.error(error);
      throw new ServerError('Something went wrong :(', [{ message: 'Failed to get user from cache.', field: 'Server' }]);
    }
  }
}
