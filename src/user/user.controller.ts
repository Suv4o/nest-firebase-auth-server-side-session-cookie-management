import { Controller, Post, Body } from '@nestjs/common';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  signUp(@Body() userRequest: UserDto): Promise<UserRecord> {
    return this.userService.createUser(userRequest);
  }
}
