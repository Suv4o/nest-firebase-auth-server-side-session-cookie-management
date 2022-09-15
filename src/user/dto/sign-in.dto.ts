import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}
