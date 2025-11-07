import { IsEmail, IsString } from 'class-validator';

export class CreateClaimCodeDto {
  @IsString()
  userId: string;

  @IsEmail()
  email: string;
}
