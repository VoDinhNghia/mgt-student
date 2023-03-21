import { collections } from 'src/constants/collections.name';
import { LookupCommon } from './lookup.query.aggregate-query';

export class LookupService {
  public award() {
    const lookup: any = new LookupCommon([this.referenceAttachment()]);
    return lookup;
  }

  public branch() {
    return this.locationBranchAndSchool();
  }

  public center() {
    const lookup: any = new LookupCommon([
      {
        from: collections.profiles,
        localField: 'director',
        foreignField: '_id',
        as: 'director',
        unwind: true,
      },
      this.referenceAward(),
      this.referenceOffice(),
    ]);
    return lookup;
  }

  public classInfo() {
    const lookup: any = new LookupCommon([
      {
        from: collections.degreelevels,
        localField: 'degreeLevel',
        foreignField: '_id',
        as: 'degreeLevel',
        unwind: true,
      },
      {
        from: collections.profiles,
        localField: 'homeroomteacher',
        foreignField: '_id',
        as: 'homeroomteacher',
        unwind: true,
      },
    ]);
    return [...this.classSubjectCommon(), ...lookup];
  }

  public subject() {
    const lookup: any = new LookupCommon([
      this.referenceSemester(),
      {
        from: collections.profiles,
        localField: 'lecturer',
        foreignField: '_id',
        as: 'lecturer',
        unwind: true,
      },
      {
        from: collections.subject_processes,
        localField: '_id',
        foreignField: 'subject',
        as: 'process',
        unwind: true,
      },
    ]);
    return [...this.classSubjectCommon(), ...lookup];
  }

  public classSubjectCommon() {
    const lookup: any = new LookupCommon([
      {
        from: collections.courses,
        localField: 'course',
        foreignField: '_id',
        as: 'course',
        unwind: true,
      },
      {
        from: collections.majors,
        localField: 'major',
        foreignField: '_id',
        as: 'major',
        unwind: true,
      },
    ]);
    return lookup;
  }

  public department() {
    const lookup: any = new LookupCommon([
      {
        from: collections.profiles,
        localField: 'manager',
        foreignField: '_id',
        as: 'manager',
        unwind: true,
      },
      this.referenceAttachment(),
      this.referenceOffice(),
    ]);
    return lookup;
  }

  public faculty() {
    const lookup: any = new LookupCommon([
      this.referenceAward(),
      {
        from: collections.profiles,
        localField: 'headOfSection',
        foreignField: '_id',
        as: 'headOfSection',
        unwind: true,
      },
      {
        from: collections.profiles,
        localField: 'eputeHead',
        foreignField: '_id',
        as: 'eputeHead',
        unwind: true,
      },
    ]);
    return lookup;
  }

  public major() {
    const lookup: any = new LookupCommon([
      {
        from: collections.faculties,
        localField: 'faculty',
        foreignField: '_id',
        as: 'faculty',
        unwind: true,
      },
    ]);
    return [...this.faculty(), ...lookup];
  }

  public institute() {
    const lookup: any = new LookupCommon([
      {
        from: collections.profiles,
        localField: 'parson',
        foreignField: '_id',
        as: 'parson',
        unwind: true,
      },
      {
        from: collections.profiles,
        localField: 'viceParson',
        foreignField: '_id',
        as: 'viceParson',
        unwind: true,
      },
      this.referenceOffice(),
      this.referenceAttachment(),
    ]);
    return lookup;
  }

  public news() {
    const lookup: any = new LookupCommon([this.referenceAttachment()]);
    return lookup;
  }

  public userPayment() {
    const lookup: any = new LookupCommon([this.referenceUser()]);
    return [...this.payment(), ...lookup];
  }

  public payment() {
    const lookup: any = new LookupCommon([this.referenceSemester()]);
    return lookup;
  }

  public permission() {
    const lookup: any = new LookupCommon([this.referenceUser()]);
    return lookup;
  }

  public semesterScholarship() {
    const lookup: any = new LookupCommon([this.referenceSemester()]);
    return lookup;
  }

  public trainningPointScholarship() {
    const lookup: any = new LookupCommon([
      {
        from: collections.voluntee_programs,
        localField: 'program',
        foreignField: '_id',
        as: 'program',
        unwind: true,
      },
    ]);
    return lookup;
  }

  public userScholarship() {
    const lookup: any = new LookupCommon([
      {
        from: collections.scholarships,
        localField: 'scholarship',
        foreignField: '_id',
        as: 'scholarship',
        unwind: true,
      },
      this.referenceUser(),
    ]);
    return lookup;
  }

  public school() {
    const lookup: any = new LookupCommon([
      {
        from: collections.attachments,
        localField: 'image',
        foreignField: '_id',
        as: 'image',
        unwind: false,
      },
      this.referenceAward(),
      {
        from: collections.attachments,
        localField: 'policy.attachment',
        foreignField: '_id',
        as: 'attachmentPolicy',
        unwind: false,
      },
    ]);
    return [...lookup, ...this.locationBranchAndSchool()];
  }

  public syncUser() {
    return this.userAndSync();
  }

  public union() {
    const lookup: any = new LookupCommon([
      {
        from: collections.profiles,
        localField: 'members.user',
        foreignField: '_id',
        as: 'user',
        unwind: true,
      },
      {
        from: collections.attachments,
        localField: 'images.attachment',
        foreignField: '_id',
        as: 'attachment',
        unwind: true,
      },
    ]);
    return lookup;
  }

  public user() {
    return this.userAndSync();
  }

  public profile() {
    const lookup: any = new LookupCommon([
      {
        from: collections.profiles,
        localField: 'user',
        foreignField: '_id',
        as: 'profile',
        unwind: true,
      },
    ]);
    return lookup;
  }

  public userAndSync() {
    const lookup: any = new LookupCommon([
      {
        from: collections.profiles,
        localField: '_id',
        foreignField: 'user',
        as: 'profile',
        unwind: true,
      },
    ]);
    return lookup;
  }

  public locationBranchAndSchool() {
    const lookup: any = new LookupCommon([
      {
        from: collections.countries,
        localField: 'location.country',
        foreignField: '_id',
        as: 'country',
        unwind: true,
      },
      {
        from: collections.provinces,
        localField: 'location.province',
        foreignField: '_id',
        as: 'province',
        unwind: true,
      },
      {
        from: collections.districts,
        localField: 'location.district',
        foreignField: '_id',
        as: 'district',
        unwind: true,
      },
      {
        from: collections.wards,
        localField: 'location.ward',
        foreignField: '_id',
        as: 'ward',
        unwind: true,
      },
    ]);
    return lookup;
  }

  referenceAttachment() {
    return {
      from: collections.attachments,
      localField: 'attachment',
      foreignField: '_id',
      as: 'attachment',
      unwind: false,
    };
  }

  referenceAward() {
    return {
      from: collections.awards,
      localField: 'award',
      foreignField: '_id',
      as: 'award',
      unwind: false,
    };
  }

  referenceOffice() {
    return {
      from: collections.rooms,
      localField: 'contacts.office',
      foreignField: '_id',
      as: 'office',
      unwind: true,
    };
  }

  referenceSemester() {
    return {
      from: collections.semesters,
      localField: 'semester',
      foreignField: '_id',
      as: 'semester',
      unwind: true,
    };
  }

  referenceUser() {
    return {
      from: collections.profiles,
      localField: 'user',
      foreignField: '_id',
      as: 'user',
      unwind: true,
    };
  }
}
