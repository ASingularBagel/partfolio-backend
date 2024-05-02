import HTTP_STATUS from 'http-status-codes';
import Logger from 'bunyan';
import { authService } from '@services/db/auth.service';
import { BadRequestError } from '@globals/helpers/error-handler';
import { cloudinaryUpload } from '@globals/helpers/cloudinary-upload';
import { config } from '@root/config';
import { Helpers } from '@globals/helpers/helpers';
import { IAuthDocument, ISignUpData } from '@auth/interfaces/auth.interface';
import { IUserDocument } from '@user/interfaces/user.interface';
import { joiValidation } from '@globals/decorators/joi-validation.decorators';
import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { signupSchema } from '@auth/schemas/signup';
import { UploadApiResponse } from 'cloudinary';
import { UserCache } from '@services/redis/user.cache';
import { omit } from 'lodash';
import { authQueue } from '@services/queues/auth.queue';
import { userQueue } from '@services/queues/user.queue';

const log: Logger = config.createLogger('SIGN_UP');
const userCache: UserCache = new UserCache();

export class Signup {
  @joiValidation(signupSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { email, username, password, avatarImage } = req.body;
    const userExists = await authService.getUserByUsernameOrEmail(username, email);

    if (userExists) {
      throw new BadRequestError('User already exists', [{ message: 'User already exists.', field: 'username' }]);
    }

    const authObjectId: ObjectId = new ObjectId();
    const userObjectId: ObjectId = new ObjectId();
    const uId: string = `${Helpers.generateRandomIntegers(12)}`;
    const authData: IAuthDocument = Signup.prototype.signupData({
      _id: authObjectId,
      uId,
      email,
      username,
      password
    });
    const result: UploadApiResponse = (await cloudinaryUpload(avatarImage, `${userObjectId}`, true, true)) as UploadApiResponse;
    log.info('Saved image to Cloudinary !');

    if (!result?.public_id) {
      throw new BadRequestError('Image upload failed.', [{ message: 'Image upload failed.', field: 'avatarImage' }]);
    }

    // save user to redis cache
    const userDataForCache: IUserDocument = Signup.prototype.userData(authData, userObjectId);
    userDataForCache.profilePicture = `https://res.cloudinary.com/${config.CLOUD_NAME}/image/upload/v${result.version}/${userObjectId}`;
    await userCache.saveUserToCache(`${userObjectId}`, uId, userDataForCache);

    // save user to mongodb
    omit(userDataForCache, ['uId', 'username', 'email', 'password']);
    authQueue.addAuthJob('addUser_auth', { value: userDataForCache });
    userQueue.addUserJob('adduser_userdb', { value: userDataForCache });

    const userJWT: string = Signup.prototype.signupToken(authData, userObjectId);
    req.session!.jwt = userJWT;

    res
      .status(HTTP_STATUS.CREATED)
      .json({ message: 'User created successfully.', authData: authData, user: userDataForCache, token: userJWT });
  }

  private signupToken(data: IAuthDocument, userObjectId: ObjectId): string {
    return Helpers.generateToken(data, userObjectId);
  }

  private signupData(data: ISignUpData): IAuthDocument {
    return {
      _id: data._id,
      uId: data.uId,
      email: data.email,
      username: data.username,
      password: data.password,
      createdAt: new Date()
    } as unknown as IAuthDocument;
  }

  private userData(data: IAuthDocument, userObjectId: ObjectId): IUserDocument {
    const { _id, username, email, uId, password } = data;

    return {
      _id: userObjectId,
      authId: _id,
      uId,
      username,
      email,
      password,
      profilePicture: '',
      blocked: [],
      blockedBy: [],
      location: '',
      bgImageId: '',
      bgImageVersion: '',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        twitch: '',
        pixiv: '',
        youtube: '',
        deviantart: ''
      }
    } as unknown as IUserDocument;
  }
}
