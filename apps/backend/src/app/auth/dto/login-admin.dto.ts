import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginAdminDto {
  @ApiProperty({
    description: 'Admin password',
    example: 'your-admin-password',
    type: 'string',
  })
  @IsString()
  password: string;
}
