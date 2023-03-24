import { collections } from 'src/constants/collections.name';
import { msgValidateEmail } from 'src/constants/message.response';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { ValidateDto } from './validate.common.dto';
import { validateEmail } from './validate.email';

export class UserValidate {
  validate = new ValidateDto();
  async email(email: string): Promise<void> {
    if (!validateEmail(email)) {
      new CommonException(400, msgValidateEmail);
    }
    await this.validate.existedByOptions(collections.users, { email }, 'Email');
  }

  async profileDto(fields: Record<string, any>): Promise<void> {
    const { major, faculty, course, degreeLevel, classId } = fields;
    if (major) {
      await this.validate.fieldId(collections.majors, major);
    }
    if (faculty) {
      await this.validate.fieldId(collections.faculties, faculty);
    }
    if (course) {
      await this.validate.fieldId(collections.courses, course);
    }
    if (degreeLevel) {
      await this.validate.fieldId(collections.degreelevels, degreeLevel);
    }
    if (classId) {
      await this.validate.fieldId(collections.class_infos, classId);
    }
  }

  async awards(
    profileDto: Record<string, any>,
    award: string[],
  ): Promise<Record<string, any>> {
    if (award.length > 0) {
      const awardIds = await this.validate.idLists(collections.awards, award);
      profileDto.award = awardIds;
    }
    return profileDto;
  }
}
