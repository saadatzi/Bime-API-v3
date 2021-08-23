import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoginOutputDto {
  @ApiProperty({
    default: 'Token',
    description: 'Access Token',
  })
  @IsNotEmpty()
  @Expose()
  readonly accessToken: string;

  @ApiProperty({
    default: 'Refresh Token',
    description: 'refresh Token',
  })
  @Expose()
  @IsNotEmpty()
  readonly refreshToken: string;
}
