import { Body, Controller, Get, UseInterceptors } from '@nestjs/common';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { Auth } from './decorators/auth.decorator';
import { CurrentUser } from './decorators/current-user.decorators';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { UserDto } from './user/dto/user.dto';
import { UserService } from './user/user.service';

@Controller('user')
// @UseInterceptors(CurrentUserInterceptor)
export class AppController {
  @Get('/morning')
  @Auth('ADMIN')
  goodMorning(@CurrentUser('email') email: string) {
    return 'Good Morning!' + email;
  }
  @Get('/afternoon')
  @Auth('DEVELOPER')
  goodAfternoon() {
    return 'Good Afternoon!';
  }
  @Get('/evening')
  goodEvening() {
    return 'Good Evening!';
  }
}
