import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { Pagination } from 'src/utils/page.pagination';
import { ValidateField } from 'src/validates/validate.field-id.dto';
import {
  Profile,
  ProfileDocument,
} from '../users/schemas/users.profile.schema';
import { CreatePermissionDto } from './dtos/permissions.create.dto';
import { QueryPermissionDto } from './dtos/permissions.query.dto';
import { UpdatePermissionDto } from './dtos/permissions.update.dto';
import {
  AdminPermission,
  AdminPermissionDocument,
} from './schemas/permission.admin.acction-frontend.schema';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(AdminPermission.name)
    private readonly permissionSchema: Model<AdminPermissionDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    private readonly validate: ValidateField,
  ) {}

  async createAdminPermission(
    permissionDto: CreatePermissionDto,
  ): Promise<AdminPermission> {
    const { user } = permissionDto;
    await this.validate.byId(this.profileSchema, user, 'User profile');
    const newDoc = await new this.permissionSchema(permissionDto).save();
    const result = await this.findAdminPermissionById(newDoc._id);
    return result;
  }

  async updateAdminPermission(
    id: string,
    permissionDto: UpdatePermissionDto,
  ): Promise<AdminPermission> {
    await this.permissionSchema.findByIdAndUpdate(id, permissionDto);
    const result = await this.findAdminPermissionById(id);
    return result;
  }

  async findAdminPermissionById(id: string): Promise<AdminPermission> {
    const result = await this.permissionSchema
      .findById(id)
      .populate('user', '', this.profileSchema)
      .exec();
    if (!result) {
      new CommonException(404, 'Permission not found.');
    }
    return result;
  }

  async findAllAdminPermission(
    queryDto: QueryPermissionDto,
  ): Promise<AdminPermission[]> {
    const { limit, page, user, searchKey } = queryDto;
    const match: Record<string, any> = { $match: {} };
    if (user) {
      match.$match = { user: new Types.ObjectId(user) };
    }
    let agg = [match];
    const lookup = [
      {
        $lookup: {
          from: 'profiles',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
    ];
    agg = [...agg, ...lookup];
    if (searchKey) {
      const matchSearchKey = {
        $match: {
          $or: [
            { moduleName: new RegExp(searchKey) },
            { 'user.firstName': new RegExp(searchKey) },
            { 'user.lastName': new RegExp(searchKey) },
          ],
        },
      };
      agg = [...agg, matchSearchKey];
    }
    const aggregate: any = new Pagination(limit, page, agg);
    const results = await this.permissionSchema.aggregate(aggregate);
    return results;
  }

  async deleteAdminPermission(id: string): Promise<void> {
    await this.findAdminPermissionById(id);
    await this.permissionSchema.findByIdAndDelete(id);
  }
}
