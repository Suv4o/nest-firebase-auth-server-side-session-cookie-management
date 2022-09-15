import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  Session,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { SignInDto } from './dto/sign-in.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(@Body() userRequest: UserDto): Promise<UserRecord> {
    return this.userService.createUser(userRequest);
  }

  @Post('signin')
  @HttpCode(200)
  async signIn(
    @Body() userRequest: SignInDto,
    @Session() session: Record<string, any>,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const { uid, sessionCookie, options } = await this.userService.signInUser(
      userRequest,
    );
    session['mfa_' + uid] = false;
    response.cookie('mfa_auth', false, options);
    response.cookie('session', sessionCookie, options);
    return { status: 'success' };
  }

  @Post('update-user')
  async updateUser(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const { options } = await this.userService.updateUser(request);
    response.cookie('mfa_auth', true, options);
    return;
  }
}
