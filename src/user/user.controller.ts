import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  UnauthorizedException,
  Inject,
  CACHE_MANAGER,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  HttpCode,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RolesGuard } from './../auth/guards/roles.guard';
import { Roles } from './../auth/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { User } from './schemas/user.schema';
import { ProfileUserDto } from './dto/profile-user-dto';
import { BaseApiResponse } from 'src/shared/dto/baseApiResponse.dto';
import { EnumMessages } from 'src/shared/dto/messeages.enum';
import { Request } from 'express';
import { AuthRequest } from 'src/auth/interfaces/auth-Request.interface';

//   import { FilterInsTypeDTO } from './dto/filter-insType.dto';
//   import {
//     FileFieldsInterceptor,
//     FileInterceptor,
//     FilesInterceptor,
//   } from '@nestjs/platform-express';
// //   import { editFileName } from 'utils/editFileName';
// //   import { imageFileFilter } from 'utils/file-uploading.utils';
//   import { diskStorage } from 'multer';
//   import { PaginationDTO } from 'Dto/pagination-query.dto';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // @Get(':imgpath')
  // seeUploadfile(@Param('imgpath') image, @Res() res) {
  //   return res.sendFile(image, { root: './files' });
  // }
  fakeString = 'my name is mojtaba';
  @Get('simple-string-fetch')
  async setGetSimpleString() {
    var value = await this.cacheManager.get('10');
    if (value) {
      return {
        data: value,
        loadsFrom: 'redis cache',
      };
    }
    await this.cacheManager.set('10', this.fakeString, { ttl: 300 });
    return {
      data: this.fakeString,
      loadsFrom: 'fake database',
    };
  }

  @Get('/profile')
  @ApiTags('admin', 'superAdmin', 'customer')
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UnauthorizedException,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProfileUserDto,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UsePipes(ValidationPipe)
  async getUserProfile(
    @Req() req: AuthRequest,
  ): Promise<BaseApiResponse<ProfileUserDto>> {
    const id = req.user._id;
    const data = await this.userService.getUserProfile(id);

    return {
      data: data,
      meta: {},
      success: true,
      msg: EnumMessages.GET_SUCCESS,
    };
  }

  // @Get('/:id')
  // getInsType(@Query('id') id: string): Promise<InsType> {
  //   return this.insTypeService.getInsType(id);
  // }

  // @ApiConsumes('multipart/form-data')
  // @ApiTags('admin', 'superAdmin')
  // @Post()
  // @Roles('admin', 'superAdmin')
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @UsePipes(ValidationPipe)
  // @UseInterceptors(
  //   FileInterceptor('image_url', {
  //     storage: diskStorage({
  //       destination: './files',
  //       filename: editFileName,
  //     }),
  //     fileFilter: imageFileFilter,
  //   }),
  // )
  // async createInsType(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() filterInsTypeDTO: FilterInsTypeDTO,
  //   // @Body('province', ObjectIdValidationPipe) provinceId: ObjectId  // if we want to validate an object id
  //   // @Req() req: any,
  // ) {
  //   // this.logger.verbose(`User ${req.user.username} creating a task. Data: ${JSON.stringify(FilterLessonDTO)}`)

  //   const response = {
  //     originalname: file.originalname,
  //     filename: `${process.env.IMAGE_URL}${file.filename}`,
  //   };
  //   filterInsTypeDTO.image_url = response.filename;
  //   const bodyRes = await this.insTypeService.createInsType(filterInsTypeDTO);

  //   return { bodyRes };
  // }

  // @ApiConsumes('multipart/form-data')
  // @Put()
  // @Roles('admin', 'superAdmin')
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @UsePipes(ValidationPipe)
  // @UseInterceptors(
  //   FileInterceptor('image_url', {
  //     storage: diskStorage({
  //       destination: './files',
  //       filename: editFileName,
  //     }),
  //     fileFilter: imageFileFilter,
  //   }),
  // )
  // updateInsType(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Query('id') id: string,
  //   @Body() filterInsTypeDTO: FilterInsTypeDTO,
  // ): Promise<InsType> {
  //   const response = {
  //     originalname: file.originalname,
  //     filename: file.filename,
  //   };
  //   filterInsTypeDTO.image_url = response.filename;
  //   return this.insTypeService.updateInsType(id, filterInsTypeDTO);
  // }

  // @Delete()
  // @Roles('admin', 'superAdmin')
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // deleteInsType(@Query('id') id: string): Promise<InsType> {
  //   return this.insTypeService.deleteInsType(id);
  // }
}
