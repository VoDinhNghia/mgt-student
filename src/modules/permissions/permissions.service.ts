import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  permissionMsg,
  userMsg,
} from 'src/constants/constants.message.response';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { selectUser } from 'src/utils/utils.populate';
import { ValidFields } from 'src/validates/validates.fields-id-dto';
import {
  Profile,
  ProfileDocument,
} from '../users/schemas/users.profile.schema';
import { CreatePermissionDto } from './dtos/permissions.create.dto';
import { QueryPermissionDto } from './dtos/permissions.query.dto';
import { UpdatePermissionDto } from './dtos/permissions.update.dto';
import { ImatchFindPermission } from './interfaces/permissions.find.match.interface';
import {
  AdminPermission,
  AdminPermissionDocument,
} from './schemas/permissions.admin.schema';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(AdminPermission.name)
    private readonly permissionSchema: Model<AdminPermissionDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
  ) {}

  async createAdminPermission(
    permissionDto: CreatePermissionDto,
    createdBy: string,
  ): Promise<AdminPermission> {
    const { user } = permissionDto;
    const valid = new ValidFields();
    await valid.id(this.profileSchema, user, userMsg.notFoundProfile);
    const dto = {
      ...permissionDto,
      createdBy,
    };
    const permission = await new this.permissionSchema(dto).save();
    return permission;
  }

  async updateAdminPermission(
    id: string,
    permissionDto: UpdatePermissionDto,
    updatedBy: string,
  ): Promise<AdminPermission> {
    const { user } = permissionDto;
    if (user) {
      const valid = new ValidFields();
      await valid.id(this.profileSchema, user, userMsg.notFoundProfile);
    }
    const dto = {
      ...permissionDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.permissionSchema.findByIdAndUpdate(id, dto, {
      new: true,
    });
    return result;
  }

  async findAdminPermissionById(id: string): Promise<AdminPermission> {
    const result = await this.permissionSchema
      .findById(id)
      .populate('user', selectUser, this.profileSchema, { isDeleted: false })
      .exec();
    if (!result) {
      new CommonException(404, permissionMsg.notFound);
    }
    return result;
  }

  async findAllAdminPermissions(
    queryDto: QueryPermissionDto,
  ): Promise<{ results: AdminPermission[]; total: number }> {
    const { limit, page, user, searchKey } = queryDto;
    const query: ImatchFindPermission = { isDeleted: false };
    if (user) {
      query.user = new Types.ObjectId(user);
    }
    if (searchKey) {
      query.moduleName = new RegExp(searchKey, 'i');
    }
    const results = await this.permissionSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .populate('user', selectUser, this.profileSchema, { isDeleted: false })
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.permissionSchema.find(query).count();
    return { results, total };
  }

  async deleteAdminPermission(id: string, deletedBy: string): Promise<void> {
    await this.findAdminPermissionById(id);
    const dto = {
      isDeleted: true,
      deletedBy,
      deletedAt: Date.now(),
    };
    await this.permissionSchema.findByIdAndUpdate(id, dto);
  }
}
