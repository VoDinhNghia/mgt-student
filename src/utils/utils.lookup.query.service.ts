import { collections } from 'src/constants/constants.collections.name';
import { lookupCommon } from './utils.lookup.query.aggregate-query';

export function awardLookup() {
  const lookup = lookupCommon([referenceAttachment()]);
  return lookup;
}

export function branchLookup() {
  return locationBranchAndSchoolLookup();
}

export function centerLookup() {
  const lookup = lookupCommon([
    {
      from: collections.profiles,
      localField: 'director',
      foreignField: '_id',
      as: 'director',
      unwind: true,
    },
    referenceAward(),
    referenceOffice(),
  ]);
  return lookup;
}

export function classInfoLookup() {
  const lookup = lookupCommon([
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
  return [...classSubjectCommon(), ...lookup];
}

export function subjectLookup() {
  const lookup = lookupCommon([
    referenceSemester(),
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
  return [...classSubjectCommon(), ...lookup];
}

export function classSubjectCommon() {
  const lookup = lookupCommon([
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

export function departmentLookup() {
  const lookup = lookupCommon([
    {
      from: collections.profiles,
      localField: 'manager',
      foreignField: '_id',
      as: 'manager',
      unwind: true,
    },
    referenceAttachment(),
    referenceOffice(),
  ]);
  return lookup;
}

export function facultyLookup() {
  const lookup = lookupCommon([
    referenceAward(),
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

export function majorLookup() {
  const lookup = lookupCommon([
    {
      from: collections.faculties,
      localField: 'faculty',
      foreignField: '_id',
      as: 'faculty',
      unwind: true,
    },
  ]);
  return [...facultyLookup(), ...lookup];
}

export function instituteLookup() {
  const lookup = lookupCommon([
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
    referenceOffice(),
    referenceAttachment(),
  ]);
  return lookup;
}

export function newsLookup() {
  const lookup = lookupCommon([referenceAttachment()]);
  return lookup;
}

export function userPaymentLookup() {
  const lookup = lookupCommon([referenceUser()]);
  return [...paymentLookup(), ...lookup];
}

export function paymentLookup() {
  const lookup = lookupCommon([referenceSemester()]);
  return lookup;
}

export function permissionLookup() {
  const lookup = lookupCommon([referenceUser()]);
  return lookup;
}

export function semesterScholarshipLookup() {
  const lookup = lookupCommon([referenceSemester()]);
  return lookup;
}

export function trainningPointScholarshipLookup() {
  const lookup = lookupCommon([
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

export function userScholarshipLookup() {
  const lookup = lookupCommon([
    {
      from: collections.scholarships,
      localField: 'scholarship',
      foreignField: '_id',
      as: 'scholarship',
      unwind: true,
    },
    referenceUser(),
  ]);
  return lookup;
}

export function syncUserLookup() {
  return userAndSyncLookup();
}

export function userLookup() {
  return userAndSyncLookup();
}

export function profileLookup() {
  const lookup = lookupCommon([
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

export function userAndSyncLookup() {
  const lookup = lookupCommon([
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

export function locationBranchAndSchoolLookup() {
  const lookup = lookupCommon([
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

export function referenceAttachment() {
  return {
    from: collections.attachments,
    localField: 'attachment',
    foreignField: '_id',
    as: 'attachment',
    unwind: false,
  };
}

export function referenceAward() {
  return {
    from: collections.awards,
    localField: 'award',
    foreignField: '_id',
    as: 'award',
    unwind: false,
  };
}

export function referenceOffice() {
  return {
    from: collections.rooms,
    localField: 'contacts.office',
    foreignField: '_id',
    as: 'office',
    unwind: true,
  };
}

export function referenceSemester() {
  return {
    from: collections.semesters,
    localField: 'semester',
    foreignField: '_id',
    as: 'semester',
    unwind: true,
  };
}

export function referenceUser() {
  return {
    from: collections.profiles,
    localField: 'user',
    foreignField: '_id',
    as: 'user',
    unwind: true,
  };
}
