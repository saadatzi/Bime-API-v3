import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { FilterInsTypeDTO } from './dto/filter-insType.dto';
import { User } from './schemas/user.schema';
import { unlinkSync } from 'fs';
import { plainToClass } from 'class-transformer';
import { ProfileUserDto } from './dto/profile-user-dto';

// import * as ConstValue from 'CustomMsg/ConstValue.json';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<User>,
  ) {}

  //   async getInsTypes(page: number, search: string): Promise<InsType[]> {
  //     const regex = search ? { name: { $regex: new RegExp(search, 'i') } } : {};
  //     page = page ? page : 1;
  //     return this.InsType.find(regex)
  //       .limit(ConstValue.Limit)
  //       .skip(ConstValue.Limit * (Number(page) - 1))
  //       .exec();
  //   }

  async getUserProfile(id): Promise<ProfileUserDto> {
    const user = await this.UserModel.findById(id);
    // .populate({
    //   path:'city',
    //   // model:City
    // })

    return plainToClass(ProfileUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  //   async createInsType(filterInsTypeDTO: FilterInsTypeDTO): Promise<InsType> {
  //     const InsType = new this.InsType(filterInsTypeDTO);

  //     try {
  //       return await InsType.save();
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }

  //   async updateInsType(
  //     id: string,
  //     filterInsTypeDTO: FilterInsTypeDTO,
  //   ): Promise<InsType> {
  //     const InsType = await this.InsType.findById(id);
  //     unlinkSync(`./files/${InsType.image_url}`);
  //     Object.assign(InsType, filterInsTypeDTO);
  //     try {
  //       return await InsType.save();
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }

  //   async deleteInsType(id: string): Promise<InsType> {
  //     try {
  //       const InsType = await this.InsType.findByIdAndDelete(id);
  //       unlinkSync(`./files/${InsType.image_url}`);
  //       return InsType;
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
}
