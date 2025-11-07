import { IsString, Length } from 'class-validator';

export class ClaimDeviceDto {
  @IsString()
  @Length(9, 9) // Format: XXXX-XXXX
  claimCode: string;

  @IsString()
  timezone: string;
}
