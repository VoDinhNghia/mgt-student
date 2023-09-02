import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonException } from 'src/exceptions/execeptions.common-error';
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
import { unionBy } from 'lodash';
import { CreateStaffDepartmentDto } from './dtos/department.staff.create.dto';
import { ErolesUser, EroomType } from 'src/constants/constant';
import { UpdateDepartmentDto } from './dtos/department.update.dto';
import { Users, UsersDocument } from '../users/schemas/users.schema';
import { UpdateStaffDepartmentDto } from './dtos/department.staff.update.dto';
import {
  departmentMsg,
  msgNotFound,
  roomMsg,
  userMsg,
} from 'src/constants/constants.message.response';
import {
  IprofileStaff,
  IqueryDeparment,
} from './interfaces/departments.interface';
import {
  Attachment,
  AttachmentDocument,
} from '../attachments/schemas/attachments.schema';
import { Rooms, RoomsDocument } from '../rooms/schemas/rooms.schema';
import { ValidFields } from 'src/validates/validates.fields-id-dto';
import {
  selectAttachment,
  selectRoom,
  selectProfile,
} from 'src/utils/utils.populate';
import { QueryDepartmentDto } from './dtos/department.query.dto';
import { HttpStatusCode } from 'src/constants/constants.http-status';

@Injectable()
export class DepartmentsService {
  private populateManager: string = 'manager';
  private populateOffice: string = 'contacts.office';
  private populateAttachment: string = 'attachment';
  private populateUser: string = 'user';
  private uniqStaff: string = 'staff';

  constructor(
    @InjectModel(Departments.name)
    private readonly deparmentSchema: Model<DepartmentsDocument>,
    @InjectModel(DepartmentStaff.name)
    private readonly staffSchema: Model<DepartmentStaffDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    @InjectModel(Users.name)
    private readonly userSchema: Model<UsersDocument>,
    @InjectModel(Attachment.name)
    private readonly attachmentSchema: Model<AttachmentDocument>,
    @InjectModel(Rooms.name)
    private readonly roomSchema: Model<RoomsDocument>,
  ) {}

  public async createDepartment(
    departmentDto: CreateDepartmentDto,
    createdBy: string,
  ): Promise<Departments> {
    const { attachment = [], manager, contacts = {} } = departmentDto;
    const valid = new ValidFields();
    await valid.id(this.profileSchema, manager, userMsg.notFoundProfile);
    const room = await this.roomSchema.findOne({
      _id: new Types.ObjectId(contacts.office),
      isDeleted: false,
      type: EroomType.OFFICE_DEPARTMENT,
    });
    if (!room) {
      new CommonException(HttpStatusCode.NOT_FOUND, roomMsg.notFound);
    }
    if (attachment.length > 0) {
      const ids = await valid.idList(this.attachmentSchema, attachment);
      departmentDto.attachment = ids;
    }
    const result = await new this.deparmentSchema({
      ...departmentDto,
      createdBy,
    }).save();

    return result;
  }

  public async updateDepartment(
    id: string,
    departmentDto: UpdateDepartmentDto,
    updatedBy: string,
  ): Promise<Departments> {
    const { attachment = [], manager, contacts = {} } = departmentDto;
    const valid = new ValidFields();
    if (manager) {
      await valid.id(this.profileSchema, manager, userMsg.notFoundProfile);
    }
    if (contacts?.office) {
      const room = await this.roomSchema.findOne({
        _id: new Types.ObjectId(contacts.office),
        isDeleted: false,
        type: EroomType.OFFICE_DEPARTMENT,
      });
      if (!room) {
        new CommonException(HttpStatusCode.NOT_FOUND, roomMsg.notFound);
      }
    }
    if (attachment.length > 0) {
      const ids = await valid.idList(this.attachmentSchema, attachment);
      departmentDto.attachment = ids;
    }
    const updateDto = {
      ...departmentDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.deparmentSchema.findByIdAndUpdate(id, updateDto, {
      new: true,
    });

    return result;
  }

  public async findDepartmentById(id: string): Promise<Departments> {
    const result = await this.deparmentSchema
      .findById(id)
      .populate(this.populateManager, selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .populate(this.populateOffice, selectRoom, this.roomSchema, {
        isDeleted: false,
      })
      .populate(
        this.populateAttachment,
        selectAttachment,
        this.attachmentSchema,
        {
          isDeleted: false,
        },
      )
      .exec();
    if (!result) {
      new CommonException(HttpStatusCode.NOT_FOUND, msgNotFound);
    }

    return result;
  }

  public async findAllDepartment(
    queryDto: QueryDepartmentDto,
  ): Promise<{ results: Departments[]; total: number }> {
    const { limit, page, searchKey, manager } = queryDto;
    const query: IqueryDeparment = { isDeleted: false };
    if (manager) {
      query.manager = new Types.ObjectId(manager);
    }
    if (searchKey) {
      query.name = new RegExp(searchKey, 'i');
    }
    const results = await this.deparmentSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .populate(this.populateManager, selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .populate(this.populateOffice, selectRoom, this.roomSchema, {
        isDeleted: false,
      })
      .populate(
        this.populateAttachment,
        selectAttachment,
        this.attachmentSchema,
        {
          isDeleted: false,
        },
      )
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.deparmentSchema.find(query).count();

    return { results, total };
  }

  public async createMultiStaffDepartment(
    staffDto: CreateMultiStaffDepartmentDto,
    createdBy: string,
  ): Promise<DepartmentStaff[]> {
    const { department, staffs = [] } = staffDto;
    await new ValidFields().id(
      this.deparmentSchema,
      department,
      departmentMsg.notFound,
    );
    const staffLists = unionBy(staffs, this.uniqStaff);
    const multiDto = [];
    for await (const item of staffLists) {
      const staffInfo = await this.findUserProfile(item.staff);
      if (!staffInfo) {
        continue;
      }
      if (staffInfo?.user?.role !== ErolesUser.STAFF) {
        continue;
      }
      const createDto = {
        department,
        staff: item?.staff,
        joinDate: item?.joinDate || Date.now(),
        createdBy,
      };
      multiDto.push(createDto);
    }
    const results = await this.staffSchema.insertMany(multiDto);

    return results;
  }

  public async createDepartmentStaff(
    staffDto: CreateStaffDepartmentDto,
    createdBy: string,
  ): Promise<DepartmentStaff> {
    const { department, staff } = staffDto;
    const valid = new ValidFields();
    await valid.id(this.deparmentSchema, department, departmentMsg.notFound);
    await valid.id(this.profileSchema, staff, userMsg.notFoundProfile);
    const result = await new this.staffSchema({
      ...staffDto,
      createdBy,
    }).save();

    return result;
  }

  public async updateDepartmentStaff(
    id: string,
    staffDto: UpdateStaffDepartmentDto,
    updatedBy: string,
  ): Promise<DepartmentStaff> {
    const { department, staff } = staffDto;
    const valid = new ValidFields();
    if (department) {
      await valid.id(this.deparmentSchema, department, departmentMsg.notFound);
    }
    if (staff) {
      await valid.id(this.profileSchema, staff, userMsg.notFoundProfile);
    }
    const updateDto = {
      ...staffDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.staffSchema.findByIdAndUpdate(id, updateDto, {
      new: true,
    });

    return result;
  }

  public async deleteDepartmentStaff(
    id: string,
    deletedBy: string,
  ): Promise<void> {
    await new ValidFields().id(
      this.staffSchema,
      id,
      departmentMsg.notFoundStaff,
    );
    const dto = {
      isDeleted: true,
      deletedBy,
      deletedAt: Date.now(),
    };
    await this.staffSchema.findByIdAndUpdate(id, dto);
  }

  private async findUserProfile(
    profile: string,
  ): Promise<IprofileStaff | null> {
    const staffInfo = await this.profileSchema
      .findOne({
        _id: new Types.ObjectId(profile),
        isDeleted: false,
      })
      .populate(this.populateUser, '', this.userSchema)
      .exec();

    return staffInfo;
  }
}
