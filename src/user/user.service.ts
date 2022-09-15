import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { FirebaseAdmin } from '../../config/firebase.setup';
import { SignInDto } from './dto/sign-in.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly admin: FirebaseAdmin) {}

  async createUser(userRequest: UserDto): Promise<UserRecord> {
    const { email, password, firstName, lastName, role } = userRequest;
    const app = this.admin.setup();

    try {
      const createdUser = await app.auth().createUser({
        email,
        password,
        displayName: `${firstName} ${lastName}`,
      });
      await app.auth().setCustomUserClaims(createdUser.uid, { role });
      return createdUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async signInUser(userRequest: SignInDto): Promise<any> {
    const { idToken } = userRequest;
    // Set session expiration to 6 minutes.
    const expiresIn = 60 * 6 * 1000;

    const app = this.admin.setup();
    try {
      const claims = await app.auth().verifyIdToken(idToken);
      const sessionCookie = await app
        .auth()
        .createSessionCookie(idToken, { expiresIn });

      const options = { maxAge: expiresIn, httpOnly: true, secure: true };
      return { uid: claims.uid, sessionCookie, options };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async updateUser(request: Request): Promise<any> {
    // const expiresIn = 60 * 6 * 1000;
    // const options = { maxAge: expiresIn, httpOnly: false, secure: true };
    const sessionCookie = request.cookies.session || '';
    const app = this.admin.setup();
    const claims = await app.auth().verifySessionCookie(sessionCookie, true);

    const dateFrom = String(new Date().getTime()).slice(0, 10);
    const dateTo = claims.exp;
    const expiresIn = Math.abs(dateTo - Number(dateFrom)) / 1000;

    console.log(dateFrom);
    console.log(dateTo);
    console.log(expiresIn);

    const options = {
      maxAge: expiresIn * 1000000,
      httpOnly: false,
      secure: true,
    };
    return { options };
    // await app
    //   .auth()
    //   .setCustomUserClaims('8qh9VYjDhQPNYCdOz5cWaAycwxK2', { role: 'ADMIN' });
  }
}
