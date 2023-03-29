/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';
import { DbConnection } from 'src/constants/constants.db.mongo.connection';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { uniq } from 'lodash';
import { validateEmail } from './validates.email';
import { msgValidateEmail } from 'src/constants/constants.message.response';
import { collections } from 'src/constants/constants.collections.name';
import { CreateDepartmentDto } from 'src/modules/departments/dtos/departments.create.dto';
import { EroomType } from 'src/constants/constant';
import { CreateCenterDto } from 'src/modules/centers/dtos/centers.create.dto';
import { UpdateCourseDto } from 'src/modules/courses/dtos/courses.update.dto';

export class ValidateDto {
  db: any = new DbConnection();

  async idLists(collection: string, ids: string[]): Promise<string[]> {
    if (ids.length === 0) {
      return ids;
    }
    const idsUniq = uniq(ids);
    const listIds = [];
    for (const id of idsUniq) {
      try {
        listIds.push(new Types.ObjectId(id));
      } catch {
        continue;
      }
    }
    const cursorFind = await this.db
      .collection(collection)
      .find({ _id: { $in: listIds }, isDeleted: false });
    const documentLists = await cursorFind.toArray();
    const documentIds = documentLists.map((document: Record<string, any>) => {
      return document._id;
    });
    return documentIds;
  }

  async fieldId(collection: string, id: string): Promise<void> {
    const result = await this.db
      .collection(collection)
      .findOne({ _id: new Types.ObjectId(id), isDeleted: false });
    if (!result) {
      new CommonException(404, `Not found ${id} in collection ${collection}.`);
    }
  }

  async fieldOptions(
    collection: string,
    options: Record<string, any>,
    message: string,
  ): Promise<void> {
    const result = await this.db
      .collection(collection)
      .findOne({ ...options, isDeleted: false });
    if (!result) {
      new CommonException(404, `${message} not found.`);
    }
  }

  async existedId(collection: string, id: string): Promise<void> {
    const result = await this.db
      .collection(collection)
      .findOne({ _id: new Types.ObjectId(id) });
    if (result) {
      new CommonException(
        409,
        `${id} existed already in collection ${collection}.`,
      );
    }
  }

  async existedByOptions(
    collection: string,
    options: Record<string, any>,
    message: string,
  ): Promise<void> {
    const result = await this.db.collection(collection).findOne(options);
    if (result) {
      new CommonException(
        409,
        `${message} existed already in collection ${collection}.`,
      );
    }
  }

  async email(email: string): Promise<void> {
    if (!validateEmail(email)) {
      new CommonException(400, msgValidateEmail);
    }
    await this.existedByOptions(collections.users, { email }, 'Email');
  }

  async awards(
    profileDto: Record<string, any>,
    award: string[],
  ): Promise<Record<string, any>> {
    if (award.length > 0) {
      const awardIds = await this.idLists(collections.awards, award);
      profileDto.award = awardIds;
    }
    return profileDto;
  }

  async faculty(dtos: Record<string, any>): Promise<void> {
    const { headOfSection, eputeHead, faculty } = dtos;
    if (headOfSection) {
      await this.fieldId(collections.profiles, headOfSection);
    }
    if (eputeHead) {
      await this.fieldId(collections.profiles, eputeHead);
    }
    if (faculty) {
      await this.fieldId(collections.faculties, faculty);
    }
  }

  async department(departmentDto: CreateDepartmentDto): Promise<void> {
    const { manager, contacts } = departmentDto;
    const { office } = contacts;
    if (office) {
      const options = {
        _id: new Types.ObjectId(contacts?.office),
        type: EroomType.OFFICE_DEPARTMENT,
      };
      await this.fieldOptions(collections.rooms, options, 'Room');
    }
    if (manager) {
      await this.fieldId(collections.profiles, manager);
    }
  }

  async degreeLevelName(degreeLevelDto: Record<string, any>): Promise<void> {
    const { name } = degreeLevelDto;
    if (name) {
      const options = { name: name.trim() };
      await this.existedByOptions(
        collections.degreelevels,
        options,
        'DegreeLevel name',
      );
    }
  }

  async courseName(courseDto: UpdateCourseDto): Promise<void> {
    const { name } = courseDto;
    if (name) {
      const options = { name: name.trim() };
      await this.existedByOptions(collections.courses, options, 'Course name');
    }
  }

  async subjectClass(dtos: Record<string, any>): Promise<void> {
    const {
      course,
      degreeLevel,
      major,
      homeroomteacher,
      semester,
      faculty,
      lecturer,
    } = dtos;
    if (course) {
      await this.fieldId(collections.courses, course);
    }
    if (homeroomteacher) {
      await this.fieldId(collections.profiles, homeroomteacher);
    }
    if (lecturer) {
      await this.fieldId(collections.profiles, lecturer);
    }
    if (semester) {
      await this.fieldId(collections.semesters, semester);
    }
    if (faculty) {
      await this.fieldId(collections.faculties, faculty);
    }
    if (major) {
      await this.fieldId(collections.majors, major);
    }
    if (degreeLevel) {
      await this.fieldId(collections.degreelevels, degreeLevel);
    }
  }

  async center(centerDto: CreateCenterDto): Promise<void> {
    const { director, contacts } = centerDto;
    const { office } = contacts;
    if (director) {
      await this.fieldId(collections.profiles, director);
    }
    if (office) {
      await this.fieldId(collections.rooms, office);
    }
  }
}
