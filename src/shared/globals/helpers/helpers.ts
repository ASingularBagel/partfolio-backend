/* eslint-disable @typescript-eslint/no-explicit-any */
import JWT from 'jsonwebtoken';
import { config } from '@root/config';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { ObjectId } from 'mongodb';

export class Helpers {
  static generateRandomIntegers(integerLength: number): number {
    return Math.floor(Math.random() * Math.pow(10, integerLength));
  }

  static generateToken(data: IAuthDocument, userObjectId: ObjectId): string {
    return JWT.sign(
      {
        userId: userObjectId,
        _id: data._id,
        uId: data.uId,
        email: data.email,
        username: data.username
      },
      config.JWT_TOKEN!
    );
  }

  static parseJSON(data: string | null): any {
    if (data === null) {
      return null;
    }

    try {
      return JSON.parse(data);
    } catch (error) {
      return data;
    }
  }
}
