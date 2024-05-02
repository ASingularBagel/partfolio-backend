import HTTP_STATUS from 'http-status-codes';
import Logger from 'bunyan';
import { authService } from '@services/db/auth.service';
import { BadRequestError } from '@globals/helpers/error-handler';
import { config } from '@root/config';
import { Helpers } from '@globals/helpers/helpers';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { IUserDocument } from '@user/interfaces/user.interface';
import { joiValidation } from '@globals/decorators/joi-validation.decorators';
import { loginUsernameSchema } from '@auth/schemas/loginUsername';
import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { userService } from '@services/db/user.service';

const log: Logger = config.createLogger('LOGIN_USERNAME_CONTROLLER');

export class LoginUsername {
  @joiValidation(loginUsernameSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;

    const existingUser: IAuthDocument = (await authService.getUserByUsername(username)) as IAuthDocument;

    if (!existingUser) {
      log.error('User not found', { username });
      throw new BadRequestError('User not found', [{ message: 'User not found', field: 'username' }]);
    }

    const passwordsMatch: boolean = await existingUser.comparePassword(password);
    if (!passwordsMatch) {
      log.error('Invalid credentials', { username });
      throw new BadRequestError('Invalid credentials', [{ message: 'Invalid credentials', field: 'password' }]);
    }

    const user: IUserDocument = (await userService.getUserById(existingUser._id.toString())) as IUserDocument;

    const userJWT: string = Helpers.generateToken(existingUser, user.authId as ObjectId);
    req.session!.jwt = userJWT;

    user.uId = existingUser.uId;
    user.username = existingUser.username;
    user.email = existingUser.email;
    user.createdAt = existingUser.createdAt;

    log.info('User logged in successfully');
    res.status(HTTP_STATUS.OK).json({ message: 'User logged in successfully.', user: user, token: userJWT });
  }
}
