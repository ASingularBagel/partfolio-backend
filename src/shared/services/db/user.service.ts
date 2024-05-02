import Logger from 'bunyan';
import mongoose from 'mongoose';
import { config } from '@root/config';
import { IUserDocument } from '@user/interfaces/user.interface';
import { UserModel } from '@user/models/user.schema';

const log: Logger = config.createLogger('USER_SERVICE');

class UserService {
  async createUser(data: IUserDocument): Promise<void> {
    try {
      UserModel.create(data);
    } catch (error) {
      log.error(error);
    }
  }

  public async getUserById(userId: string): Promise<IUserDocument> {
    const users: IUserDocument[] = await UserModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      { $lookup: { from: 'User', localField: '_id', foreignField: '_id', as: 'userDetails' } },
      { $unwind: '$userDetails' },
      { $project: this.aggregateProject() }
    ]);
    return users[0];
  }

  public async getUserByAuthId(authId: string): Promise<IUserDocument> {
    const users: IUserDocument[] = await UserModel.aggregate([
      { $match: { authId: new mongoose.Types.ObjectId(authId) } },
      { $lookup: { from: 'User', localField: 'authId', foreignField: 'authId', as: 'userDetails' } },
      { $unwind: '$userDetails' },
      { $project: this.aggregateProject() }
    ]);
    return users[0];
  }

  private aggregateProject() {
    return {
      _id: 1,
      username: '$userDetails.username',
      uId: '$userDetails.uId',
      email: '$userDetails.email',
      createdAt: '$userDetails.createdAt',
      role: 1,
      authId: 1,
      postsCount: 1,
      work: 1,
      school: 1,
      quote: 1,
      location: 1,
      blocked: 1,
      blockedBy: 1,
      followersCount: 1,
      followingCount: 1,
      notifications: 1,
      social: 1,
      bgImageVersion: 1,
      bgImageId: 1,
      profilePicture: 1
    };
  }
}

export const userService: UserService = new UserService();
