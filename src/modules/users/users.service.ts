import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersCreateDto } from './dto/users.create.dto';
import { Users, UsersDocument } from './schemas/users.schema';
import { Profile, ProfileDocument } from './schemas/users.profile.schema';
import { cryptoPassWord } from 'src/commons/crypto';
import { roles, statusUser } from 'src/commons/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userSchema: Model<UsersDocument>,
    @InjectModel(Profile.name) private readonly profileSchema: Model<ProfileDocument>
  ) {}

  async create(UsersCreateDto: UsersCreateDto): Promise<Users> {
    UsersCreateDto.passWord = cryptoPassWord(UsersCreateDto.passWord);
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

  async findByEmailAndPass(email: string, passWord: string) {
    const pass = cryptoPassWord(passWord);
    return this.userSchema.findOne({ email, pass });
  }

  async findByEmail(email: string) {
    return this.userSchema.findOne({ email });
  }

  async update(id: string, payload: {}) {
    return this.userSchema.findByIdAndUpdate(id, payload);
  }

  async initAdmin() {
    const info = {
      email: 'admin.students@gmail.com',
      passWord: cryptoPassWord('123Code#'),
      status: statusUser.ACTIVE,
      statusLogin: false,
      role: roles.ADMIN,
    }
    const existedAdmin = await this.findByEmail(info.email);
    let createAdmin;
    let createProfileAdmin;
    if (!existedAdmin) {
      try {
        createAdmin = await new this.userSchema({
          ...info,
          createdAt: new Date(),
        }).save();
      } catch (error) {
        console.log(error);
      }
      if (createAdmin) {
       try {
        createProfileAdmin = await new this.profileSchema({
          firstName: 'Admin',
          lastName: 'Student',
          userId: createAdmin._id,
          createdAt: new Date(),
        }).save()
       } catch (error) {
         console.log(error);
       }
        if (!createProfileAdmin) {
          this.userSchema.findByIdAndDelete(createAdmin._id);
        }
      }
    }
    return createAdmin;
  }

}
