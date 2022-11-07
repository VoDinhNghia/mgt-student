import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersCreateDto } from './dto/users.create.dto';
import { Users, UsersDocument } from './schemas/users.schema';
import { Profile, ProfileDocument } from './schemas/users.profile.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userSchema: Model<UsersDocument>,
    @InjectModel(Profile.name) private readonly profileSchema: Model<ProfileDocument>
  ) {}

  async create(UsersCreateDto: UsersCreateDto): Promise<Users> {
    const createUser = await new this.userSchema({
      ...UsersCreateDto,
      createdAt: new Date(),
    }).save();
    if (!createUser.id) {
        return null;
    }
    try {
      await new this.profileSchema({
        ...UsersCreateDto,
        userId: createUser._id,
        createdAt: new Date(),
      }).save()
    } catch (error) {
      await this.userSchema.findByIdAndDelete(createUser._id).exec();
      return null
    }
    return createUser
  }

  async findOne(email: string, passWord: string): Promise<Users> {
    return this.userSchema.findOne({ email, passWord }).exec();
  }

}
