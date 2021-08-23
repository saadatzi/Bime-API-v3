// import { RefreshToken } from './interfaces/refresh-token.interface';
import { v4 } from 'uuid';
import { getClientIp } from 'request-ip';
import * as Cryptr from 'cryptr';
import { plainToClass } from 'class-transformer';
import {
  ConflictException,
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../user/schemas/user.schema';
import { sign } from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from './schemas/refresh-token.schema';
import { LoginOutputDto } from './dto/login-output.dto';
import { EnumMessages } from 'src/shared/dto/messeages.enum';
// import { LoggerService } from '@shared/logger.service';
// import * as ERR from './../CustomMsg/ERR.json';

@Injectable()
export class AuthService {
  cryptr: any;
  // private readonly logger = new LoggerService('AuthService');
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
    private readonly jwtService: JwtService,
  ) {
    this.cryptr = new Cryptr(process.env.ENCRYPT_JWT_SECRET);
  }
  async addSuperAdmin(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    createUserDto.password = await this.hashPassword(
      createUserDto.password,
      salt,
    );
    createUserDto['salt'] = salt;
    createUserDto['username'] = 'antCoders';
    createUserDto['role'] = 'superAdmin';
    const superAdmin = await this.userModel.findOne({
      role: 'superAdmin',
    });
    if (superAdmin) {
      throw new ConflictException('super admin already exist');
    }
    const createdUser = new this.userModel(createUserDto);
    try {
      let user = await createdUser.save();
      return user;
    } catch (err) {
      console.log(err);
      // if (err.code in ERR) {
      //   throw new ConflictException(ERR[err.code] + err.keyPattern);
      // } else {
      //   throw new InternalServerErrorException(err);
      // }
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async login(
    req: Request,
    loginUserDto: LoginUserDto,
  ): Promise<LoginOutputDto> {
    console.log(loginUserDto);
    const user = await this.validateUserPassword(loginUserDto);
    if (!user)
      throw new UnauthorizedException(
        EnumMessages.LOGIN_INCORRECT_MOBILE_OR_PASSWORD,
      );

    this.isUserBlocked(user);
    const userId = user._id;
    const accessToken = await this.createAccessToken(userId);
    const refreshToken = await this.createRefreshToken(req, userId);
    // this.logger.log(
    //   `Generated JWT Token with payload  ${JSON.stringify(payload)}`,
    // );
    let as = 85;
    let response = {
      accessToken,
      refreshToken,
      as,
    };
    return plainToClass(LoginOutputDto, response, {
      excludeExtraneousValues: true,
    });
  }

  private async validateUserPassword(loginUserDto: LoginUserDto) {
    const { validationInput, password } = loginUserDto;

    const srchVal = this.mobileOEmailOUsername(validationInput);
    const user = await this.userModel.findOne({ [srchVal]: validationInput });

    if (user && (await this.validatePassword(user, password))) {
      return user;
    } else {
      return null;
    }
  }

  private async validatePassword(
    user: User,
    password: string,
  ): Promise<boolean> {
    const hash = await bcrypt.hash(password, user.salt);
    return hash === user.password;
  }

  private mobileOEmailOUsername(validationInput: string): string {
    if (validationInput.match(/[+0]{1}[\d]{10,12}/)) return 'mobile';
    if (validationInput.match(/[\d\w]+\@[\d\w]+\.[\w]{2,5}/)) return 'email';
    if (validationInput.match(/[\d\w]+/)) return 'username';

    return null;
  }

  private isUserBlocked(user) {
    if (user.block) {
      throw new ConflictException(EnumMessages.BLOCK);
    }
  }

  async createAccessToken(userId: string) {
    const accessToken = sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
    return this.encryptText(accessToken);
  }

  async createRefreshToken(req: Request, userId) {
    const refreshToken = new this.refreshTokenModel({
      userId,
      refreshToken: v4(),
      ip: this.getIp(req),
      browser: this.getBrowserInfo(req),
      country: this.getCountry(req),
    });
    await refreshToken.save();
    return refreshToken.refreshToken;
  }

  private jwtExtractor(request) {
    let token = null;
    if (request.header('x-token')) {
      token = request.get('x-token');
    } else if (request.headers.authorization) {
      token = request.headers.authorization
        .replace('Bearer ', '')
        .replace(' ', '');
    } else if (request.body.token) {
      token = request.body.token.replace(' ', '');
    }
    if (request.query.token) {
      token = request.body.token.replace(' ', '');
    }
    const cryptr = new Cryptr(process.env.ENCRYPT_JWT_SECRET);
    if (token) {
      try {
        token = cryptr.decrypt(token);
      } catch (err) {
        throw new BadRequestException(EnumMessages.NO_TOKEN);
      }
    }
    return token;
  }

  //   async findRefreshToken(token: string) {
  //     const refreshToken = await this.refreshTokenModel.findOne({
  //       refreshToken: token,
  //     });
  //     if (!refreshToken) {
  //       throw new UnauthorizedException('User has been logged out.');
  //     }
  //     return refreshToken.userId;
  //   }

  //

  async validateUser(jwtPayload: JwtPayload): Promise<any> {
    const user = await this.userModel.findOne({
      _id: jwtPayload.userId,
      block: false,
    });
    if (!user) {
      throw new UnauthorizedException('User not found...');
    }
    return user;
  }

  returnJwtExtractor() {
    return this.jwtExtractor;
  }

  getIp(req: Request): string {
    return getClientIp(req);
  }

  getBrowserInfo(req: Request): string {
    return req.header['user-agent'] || 'XX';
  }

  getCountry(req: Request): string {
    return req.header['cf-ipcountry'] ? req.header['cf-ipcountry'] : 'XX';
  }

  encryptText(text: string): string {
    return this.cryptr.encrypt(text);
  }
}
