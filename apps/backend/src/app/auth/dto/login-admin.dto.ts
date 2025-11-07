import { IsString } from 'class-validator';

export class LoginAdminDto {
  @IsString()
  password: string;
}
