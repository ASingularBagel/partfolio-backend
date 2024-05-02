import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { AuthModel } from '@auth/models/auth.schema';

class AuthService {
  public async getUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument | null> {
    const query = {
      $or: [{ username }, { email }]
    };
    const user: IAuthDocument = (await AuthModel.findOne(query).exec()) as IAuthDocument;
    return user;
  }

  public async getUserByEmail(email: string): Promise<IAuthDocument | null> {
    const user: IAuthDocument = (await AuthModel.findOne({ email }).exec()) as IAuthDocument;
    return user;
  }

  public async getUserByUsername(username: string): Promise<IAuthDocument | null> {
    const user: IAuthDocument = (await AuthModel.findOne({ username }).exec()) as IAuthDocument;
    return user;
  }

  public async addUserToDb(data: IAuthDocument): Promise<void> {
    await AuthModel.create(data);
  }
}

export const authService: AuthService = new AuthService();
