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
import { ErolesUser, EroomType } from 'src/constants/constant';
import { UpdateDepartmentDto } from './dtos/department.update.dto';
import { Users, UsersDocument } from '../users/schemas/users.schema';
import { UpdateStaffDepartmentDto } from './dtos/department.staff.update.dto';
import { LookupCommon } from 'src/utils/lookup.query.aggregate-query';
import { ValidateDto } from 'src/validates/validate.common.dto';

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

  async validateDepartmentDto(
    departmentDto: CreateDepartmentDto,
  ): Promise<void> {
    const { manager, contacts } = departmentDto;
    const { office } = contacts;
    const validate = new ValidateDto();
    if (office) {
      const options = {
        _id: new Types.ObjectId(contacts?.office),
        type: EroomType.OFFICE_DEPARTMENT,
      };
      await validate.fieldOptions('rooms', options, 'Room');
    }
    if (manager) {
      await validate.fieldId('profiles', manager);
    }
  }

  async createDepartment(
    departmentDto: CreateDepartmentDto,
  ): Promise<Departments> {
    const { attachment = [] } = departmentDto;
    await this.validateDepartmentDto(departmentDto);
    if (attachment.length > 0) {
      const ids = await new ValidateDto().idLists('attachments', attachment);
      departmentDto.attachment = ids;
    }
    const newDocument = await new this.deparmentSchema(departmentDto).save();
    const result = await this.findDepartmentById(newDocument._id);
    return result;
  }

  async updateDepartment(
    id: string,
    departmentDto: UpdateDepartmentDto,
  ): Promise<Departments> {
    const { attachment = [] } = departmentDto;
    await this.validateDepartmentDto(departmentDto);
    if (attachment.length > 0) {
      const ids = await new ValidateDto().idLists('attachments', attachment);
      departmentDto.attachment = ids;
    }
    await this.deparmentSchema.findByIdAndUpdate(id, departmentDto);
    const result = await this.findDepartmentById(id);
    return result;
  }

  async findDepartmentById(id: string): Promise<Departments> {
    const match: Record<string, any> = {
      $match: { _id: new Types.ObjectId(id) },
    };
    const lookup = this.lookupDepartment();
    const aggregate = [match, ...lookup];
    const result = await this.deparmentSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, 'Department not found.');
    }
    return result[0];
  }

  async findAllDepartment(): Promise<Departments[]> {
    const aggregateLookup = this.lookupDepartment();
    const results = await this.deparmentSchema.aggregate(aggregateLookup);
    return results;
  }

  async createMultiStaffDepartment(
    staffDto: CreateMultiStaffDepartmentDto,
  ): Promise<Department_Staff[]> {
    const { department, staffs = [] } = staffDto;
    await this.findDepartmentById(department);
    const staffLists = unionBy(staffs, 'staff');
    const results = [];
    for (const item of staffLists) {
      try {
        const staffInfo = await this.findUserProfile(item.staff);
        if (!staffInfo) {
          continue;
        }
        if (staffInfo.user?.role !== ErolesUser.STAFF) {
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

  async createDepartmentStaff(
    staffDto: CreateStaffDepartmentDto,
  ): Promise<Department_Staff> {
    const { department, staff } = staffDto;
    await this.findDepartmentById(department);
    const staffInfo = await this.findUserProfile(staff);
    if (!staffInfo) {
      new CommonException(404, 'Staff not found.');
    }
    const result = await new this.staffSchema(staffDto).save();
    return result;
  }

  async updateDepartmentStaff(
    id: string,
    staffDto: UpdateStaffDepartmentDto,
  ): Promise<Department_Staff> {
    const { department, joinDate } = staffDto;
    if (department) {
      await this.findDepartmentById(department);
    }
    const staff: Record<string, any> = await this.staffSchema.findById(id);
    if (!staff) {
      new CommonException(404, 'Staff not found.');
    }
    staff.department = department || staff.department;
    staff.joinDate = joinDate || staff.joinDate;
    await staff.save();
    return staff;
  }

  async deleteDepartmentStaff(id: string): Promise<void> {
    const staff: Record<string, any> = await this.staffSchema.findById(id);
    if (!staff) {
      new CommonException(404, 'Staff not found.');
    }
    await this.staffSchema.findByIdAndDelete(id);
  }

  async findUserProfile(profile: string): Promise<Record<string, any>> {
    const staffInfo: Record<string, any> = await this.profileSchema
      .findById(profile)
      .populate('user', '', this.userSchema)
      .exec();
    return staffInfo;
  }

  private lookupDepartment() {
    const lookup: any = new LookupCommon([
      {
        from: 'profiles',
        localField: 'manager',
        foreignField: '_id',
        as: 'manager',
        unwind: true,
      },
      {
        from: 'attachments',
        localField: 'attachment',
        foreignField: '_id',
        as: 'attachment',
        unwind: false,
      },
      {
        from: 'rooms',
        localField: 'contacts.office',
        foreignField: '_id',
        as: 'office',
        unwind: true,
      },
      {
        from: 'department_staffs',
        localField: '_id',
        foreignField: 'department',
        as: 'departmentStaff',
        unwind: true,
      },
      {
        from: 'profiles',
        localField: 'departmentStaff.staff',
        foreignField: '_id',
        as: 'staffLists',
        unwind: true,
      },
    ]);
    return lookup;
  }
}
