import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { EnumMessages } from 'src/shared/dto/messeages.enum';

export class LoginUserDto {
  @ApiProperty({
    default: '09120069570',
    description: 'The email || mobile || username of the User',
    uniqueItems: true,
    type: 'string',
  })
  @IsNotEmpty({ message: `$property ==> ${EnumMessages.EMPTY_FIELD}` })
  @IsString({ message: `$property ==> ${EnumMessages.INVALID_TYPE}` })
  readonly validationInput: string;

  @ApiProperty({
    description: 'The password of the User',
    default: '123456',
    type: 'string',
  })
  @IsNotEmpty({ message: `$property ==> ${EnumMessages.EMPTY_FIELD}` })
  @IsString({ message: `$property ==> ${EnumMessages.INVALID_TYPE}` })
  readonly password: string;
}
