import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { collections } from 'src/constants/collections.name';
import { msgNotFound } from 'src/constants/message.response';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { LookupService } from 'src/utils/lookup.query.service';
import { Pagination } from 'src/utils/page.pagination';
import { ValidateDto } from 'src/validates/validate.common.dto';
import { CreatePermissionDto } from './dtos/permissions.create.dto';
import { QueryPermissionDto } from './dtos/permissions.query.dto';
import { UpdatePermissionDto } from './dtos/permissions.update.dto';
import {
  Admin_Permission,
  AdminPermissionDocument,
} from './schemas/permission.admin.acction-frontend.schema';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Admin_Permission.name)
    private readonly permissionSchema: Model<AdminPermissionDocument>,
  ) {}

  async createAdminPermission(
    permissionDto: CreatePermissionDto,
    createdBy: string,
  ): Promise<Admin_Permission> {
    const { user } = permissionDto;
    await new ValidateDto().fieldId(collections.profiles, user);
    const dto = {
      ...permissionDto,
      createdBy,
    };
    const permission = await new this.permissionSchema(dto).save();
    const result = await this.findAdminPermissionById(permission._id);
    return result;
  }

  async updateAdminPermission(
    id: string,
    permissionDto: UpdatePermissionDto,
    updatedBy: string,
  ): Promise<Admin_Permission> {
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

  async findAdminPermissionById(id: string): Promise<Admin_Permission> {
    const match = [{ $match: { _id: new Types.ObjectId(id) } }];
    const lookup = new LookupService().permission();
    const aggregate = [match, ...lookup];
    const result = await this.permissionSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, msgNotFound);
    }
    return result[0];
  }

  async findAllAdminPermissions(
    queryDto: QueryPermissionDto,
  ): Promise<Admin_Permission[]> {
    const { limit, page, user, searchKey } = queryDto;
    const match: Record<string, any> = { $match: { isDeleted: false } };
    if (user) {
      match.$match = { user: new Types.ObjectId(user) };
    }
    let agg = [match];
    const lookup = new LookupService().permission();
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
