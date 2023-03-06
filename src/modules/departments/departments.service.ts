import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonException } from 'src/exceptions/execeptionError';
import {
  Attachment,
  AttachmentDocument,
} from '../attachments/schemas/attachments.schema';
import {
  Profile,
  ProfileDocument,
} from '../users/schemas/users.profile.schema';
import { CreateMultiStaffDepartmentDto } from './dtos/department.staff.create-multi.dto';
import { CreateDepartmentDto } from './dtos/departments.create.dto';
import { Departments, DepartmentsDocument } from './schemas/departments.schema';
import {
  DepartmentStaff,
  DepartmentStaffDocument,
} from './schemas/departments.staff.schema';
import _ from 'lodash';
import { CreateStaffDepartmentDto } from './dtos/department.staff.create.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Departments.name)
    private readonly deparmentSchema: Model<DepartmentsDocument>,
    @InjectModel(DepartmentStaff.name)
    private readonly staffSchema: Model<DepartmentStaffDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    @InjectModel(Attachment.name)
    private readonly attachmentSchema: Model<AttachmentDocument>,
  ) {}

  async createDepartment(
    departmentDto: CreateDepartmentDto,
  ): Promise<Departments> {
    const { manager } = departmentDto;
    const managerInfo = await this.profileSchema.findById(manager);
    if (!managerInfo) {
      new CommonException(404, 'Manager not found.');
    }
    const newDocument = await new this.deparmentSchema(departmentDto).save();
    const result = await this.findDepartmentById(newDocument._id);
    return result;
  }

  async findDepartmentById(id: string): Promise<Departments> {
    const result = await this.deparmentSchema
      .findById(id)
      .populate('manager', '', this.profileSchema)
      .populate('attachment', '', this.attachmentSchema)
      .exec();
    if (!result) {
      new CommonException(404, 'Department not found.');
    }
    return result;
  }

  async createMultiStaffDepartment(
    staffDto: CreateMultiStaffDepartmentDto,
  ): Promise<DepartmentStaff[]> {
    const { department, staffs = [] } = staffDto;
    const departmentInfo = await this.deparmentSchema.findById(department);
    if (!departmentInfo) {
      new CommonException(404, 'Department not found.');
    }
    const staffLists = _.uniqBy(staffs, 'staff');
    const results = [];
    for (const item of staffLists) {
      try {
        const staffInfo = await this.profileSchema.findById(item.staff);
        if (!staffInfo) {
          continue;
        }
        const dto: CreateStaffDepartmentDto | Record<string, any> = {
          department,
          staff: item?.staff,
          joinDate: item?.joinDate || Date.now(),
        };
        const result = await new this.staffSchema(dto).save();
        results.push(result);
      } catch (error) {
        console.log(error);
        continue;
      }
    }
    return results;
  }
}
