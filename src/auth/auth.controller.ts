import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/schemas/user.schema';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { LoginOutputDto } from './dto/login-output.dto';
import { BaseApiResponse } from 'src/shared/dto/baseApiResponse.dto';
import { EnumMessages } from 'src/shared/dto/messeages.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @ApiTags('users')
  // @ApiOperation({
  //   summary: 'Remember to use capital and lower letter and sign',
  // })
  // @Post('/signup')
  // signUp(
  //   @Body(ValidationPipe) authCredentialDto: AuthCredentialDto,
  // ): Promise<User> {
  //   return this.authService.signUp(authCredentialDto);
  // }

  @ApiTags('customer', 'admin', 'superAdmin')
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UnauthorizedException,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginOutputDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(
    @Req() req: Request,
    @Body(ValidationPipe) loginUserDto: LoginUserDto,
  ): Promise<BaseApiResponse<LoginOutputDto>> {
    console.log(loginUserDto);
    const data = await this.authService.login(req, loginUserDto);
    return {
      data: data,
      meta: {},
      success: true,
      msg: EnumMessages.GET_SUCCESS,
    };
  }

  @ApiTags('superAdmin')
  @ApiOperation({
    summary: 'add super admin all time has one super admin',
  })
  @HttpCode(HttpStatus.CREATED)
  // @ApiResponse({})
  @Post('/addsuperadmin')
  addSuperAdmin(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.authService.addSuperAdmin(createUserDto);
  }
}
