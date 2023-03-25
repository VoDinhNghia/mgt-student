/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonException } from 'src/exceptions/exeception.common-error';
import {
  Profile,
  ProfileDocument,
} from '../users/schemas/users.profile.schema';
import { CreateMultiStaffDepartmentDto } from './dtos/department.staff.create-multi.dto';
import { CreateDepartmentDto } from './dtos/departments.create.dto';
import { Departments, DepartmentsDocument } from './schemas/departments.schema';
import {
  Department_Staff,
  DepartmentStaffDocument,
} from './schemas/departments.staff.schema';
import { unionBy } from 'lodash';
import { CreateStaffDepartmentDto } from './dtos/department.staff.create.dto';
import { ErolesUser } from 'src/constants/constant';
import { UpdateDepartmentDto } from './dtos/department.update.dto';
import { Users, UsersDocument } from '../users/schemas/users.schema';
import { UpdateStaffDepartmentDto } from './dtos/department.staff.update.dto';
import { ValidateDto } from 'src/validates/validate.common.dto';
import { collections } from 'src/constants/collections.name';
import { LookupService } from 'src/utils/lookup.query.service';
import { msgNotFound } from 'src/constants/message.response';
import { ImatchFindDeparment } from './interfaces/departments.match.find';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Departments.name)
    private readonly deparmentSchema: Model<DepartmentsDocument>,
    @InjectModel(Department_Staff.name)
    private readonly staffSchema: Model<DepartmentStaffDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    @InjectModel(Users.name)
    private readonly userSchema: Model<UsersDocument>,
  ) {}

  async createDepartment(
    departmentDto: CreateDepartmentDto,
    createdBy: string,
  ): Promise<Departments> {
    const { attachment = [] } = departmentDto;
    await new ValidateDto().department(departmentDto);
    if (attachment.length > 0) {
      const ids = await new ValidateDto().idLists(
        collections.attachments,
        attachment,
      );
      departmentDto.attachment = ids;
    }
    const newDocument = await new this.deparmentSchema({
      ...departmentDto,
      createdBy,
    }).save();
    const result = await this.findDepartmentById(newDocument._id);
    return result;
  }

  async updateDepartment(
    id: string,
    departmentDto: UpdateDepartmentDto,
    updatedBy: string,
  ): Promise<Departments> {
    const { attachment = [] } = departmentDto;
    await new ValidateDto().department(departmentDto);
    if (attachment.length > 0) {
      const ids = await new ValidateDto().idLists(
        collections.attachments,
        attachment,
      );
      departmentDto.attachment = ids;
    }
    const dto = {
      ...departmentDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.deparmentSchema.findByIdAndUpdate(id, dto, {
      new: true,
    });
    return result;
  }

  async findDepartmentById(id: string): Promise<Departments> {
    const match: ImatchFindDeparment = {
      $match: { _id: new Types.ObjectId(id) },
    };
    const lookup = new LookupService().department();
    const aggregate = [match, ...lookup];
    const result = await this.deparmentSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, msgNotFound);
    }
    return result[0];
  }

  async findAllDepartment(): Promise<Departments[]> {
    const match: ImatchFindDeparment = { $match: { isDeleted: false } };
    const aggregateLookup = new LookupService().department();
    const aggregate = [match, ...aggregateLookup];
    const results = await this.deparmentSchema.aggregate(aggregate);
    return results;
  }

  async createMultiStaffDepartment(
    staffDto: CreateMultiStaffDepartmentDto,
    createdBy: string,
  ): Promise<Department_Staff[]> {
    const { department, staffs = [] } = staffDto;
    await this.findDepartmentById(department);
    const staffLists = unionBy(staffs, 'staff');
    const results = [];
    for await (const item of staffLists) {
      try {
        const staffInfo = await this.findUserProfile(item.staff);
        if (!staffInfo) {
          continue;
        }
        const userInfo: Users | any = staffInfo?.user;
        if (userInfo?.role !== ErolesUser.STAFF) {
          continue;
        }
        const dto = {
          department,
          staff: item?.staff,
          joinDate: item?.joinDate || Date.now(),
          createdBy,
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

  async createDepartmentStaff(
    staffDto: CreateStaffDepartmentDto,
    createdBy: string,
  ): Promise<Department_Staff> {
    const { department, staff } = staffDto;
    await this.findDepartmentById(department);
    const staffInfo = await this.findUserProfile(staff);
    if (!staffInfo) {
      new CommonException(404, msgNotFound);
    }
    const result = await new this.staffSchema({
      ...staffDto,
      createdBy,
    }).save();
    return result;
  }

  async updateDepartmentStaff(
    id: string,
    staffDto: UpdateStaffDepartmentDto,
    updatedBy: string,
  ): Promise<Department_Staff> {
    const { department, joinDate } = staffDto;
    if (department) {
      await this.findDepartmentById(department);
    }
    const staff: DepartmentStaffDocument = await this.staffSchema.findById(id);
    if (!staff) {
      new CommonException(404, msgNotFound);
    }
    staff.department = department
      ? new Types.ObjectId(department)
      : staff.department;
    staff.joinDate = joinDate || staff.joinDate;
    staff.updatedBy = new Types.ObjectId(updatedBy);
    staff.updatedAt = new Date(Date.now());
    await staff.save();
    return staff;
  }

  async deleteDepartmentStaff(id: string, deletedBy: string): Promise<void> {
    const staff: DepartmentStaffDocument = await this.staffSchema.findById(id);
    if (!staff) {
      new CommonException(404, msgNotFound);
    }
    const dto = {
      isDeleted: true,
      deletedBy,
      deletedAt: Date.now(),
    };
    await this.staffSchema.findByIdAndUpdate(id, dto);
  }

  async findUserProfile(profile: string): Promise<ProfileDocument> {
    const staffInfo = await this.profileSchema
      .findOne({
        _id: new Types.ObjectId(profile),
        isDeleted: false,
      })
      .populate('user', '', this.userSchema)
      .exec();
    return staffInfo;
  }
}
