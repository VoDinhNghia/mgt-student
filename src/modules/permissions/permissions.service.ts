import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  permissionMsg,
  userMsg,
} from 'src/constants/constants.message.response';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { selectProfile } from 'src/utils/utils.populate';
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
import { HttpStatusCode } from 'src/constants/constants.http-status';

@Injectable()
export class PermissionsService {
  private populateUser: string = 'user';

  constructor(
    @InjectModel(AdminPermission.name)
    private readonly permissionSchema: Model<AdminPermissionDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
  ) {}

  public async createAdminPermission(
    permissionDto: CreatePermissionDto,
    createdBy: string,
  ): Promise<AdminPermission> {
    const { user, moduleName } = permissionDto;
    const valid = new ValidFields();
    await valid.id(this.profileSchema, user, userMsg.notFoundProfile);
    const existed = await this.permissionSchema.findOne({
      moduleName,
      user: new Types.ObjectId(user),
    });
    if (existed) {
      new CommonException(HttpStatusCode.CONFLICT, permissionMsg.existed);
    }
    const dto = {
      ...permissionDto,
      createdBy,
    };
    const permission = await new this.permissionSchema(dto).save();

    return permission;
  }

  public async updateAdminPermission(
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

  public async findAdminPermissionById(id: string): Promise<AdminPermission> {
    const result = await this.permissionSchema
      .findById(id)
      .populate(this.populateUser, selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .exec();
    if (!result) {
      new CommonException(HttpStatusCode.NOT_FOUND, permissionMsg.notFound);
    }

    return result;
  }

  public async findAllAdminPermissions(
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
      .populate(this.populateUser, selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.permissionSchema.find(query).count();

    return { results, total };
  }

  public async deleteAdminPermission(id: string): Promise<void> {
    await this.findAdminPermissionById(id);
    await this.permissionSchema.findByIdAndDelete(id);
  }
}
