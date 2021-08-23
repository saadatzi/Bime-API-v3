import {
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { isValidObjectId } from 'mongoose';
import { UsePipes } from '@nestjs/common';
import { ParseObjectIdPipe } from 'src/pipes/objectId-validation.pipe';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @ApiProperty({
    description: 'New User firstName',
    default: 'Antcoders',
    type: 'string',
    minLength: 2,
    maxLength: 255,
  })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(255)
  @ApiProperty({
    description: 'New User lastName',
    default: 'Team',
    type: 'string',
    minLength: 2,
    maxLength: 255,
  })
  lastName: string;

  @IsString()
  @MinLength(4)
  @MaxLength(30)
  @IsNotEmpty()
  @ApiProperty({
    required: false,
    description: 'username for all users',
    default: 'AntCoders',
    type: 'string',
    minLength: 2,
    maxLength: 255,
  })
  username: string;

  @IsString()
  @MinLength(10)
  @MaxLength(14)
  @IsNotEmpty()
  @ApiProperty({
    description: 'mobile for all users',
    default: '09120069570',
    required: true,
    type: 'string',
    minLength: 10,
    maxLength: 14,
  })
  mobile: string;

  @IsString()
  @MinLength(4)
  @MaxLength(255)
  @ApiProperty({
    required: false,
    description: 'address for all users',
    default: 'Mirdamad',
    type: 'string',
    minLength: 4,
    maxLength: 255,
  })
  address: string;

  @IsString()
  @ApiProperty({
    required: false,
    description: 'avatar for all users',
    default: 'avatar.png',
    type: 'string',
  })
  avatar: string;

  @IsDateString()
  @ApiProperty({
    description: 'birthday',
    required: false,
    type: 'string',
    default: '2021-02-21',
  })
  birthday: Date;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: 'email for all users',
    default: 'antcodersteam@gmail.com',
    type: 'string',
    minLength: 4,
    maxLength: 255,
  })
  email: string;

  @ApiProperty({
    description: 'object id from city',
    default: '60c5fcf47db03439e47fe76d',
    required: false,
  })
  city: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  @ApiProperty({
    required: true,
    description: 'password for all users',
    default: '123456',
    type: 'string',
    minLength: 6,
    maxLength: 255,
  })
  password: string;

  @IsIn(['male', 'female'])
  @IsString()
  @ApiProperty({
    required: true,
    description: 'gender for all users male or female',
    default: 'male',
    type: 'string',
  })
  sex: string;
}
