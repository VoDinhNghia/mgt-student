import { collections } from 'src/constants/constants.collections.name';
import { lookupCommon } from './utils.lookup.query.aggregate-query';

export function awardLookup() {
  const lookup = lookupCommon([referenceAttachment()]);
  return lookup;
}

export function branchLookup() {
  return locationBranchAndSchoolLookup();
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
    {
      from: collections.degreelevels,
      localField: 'degreeLevel',
      foreignField: '_id',
      as: 'degreeLevel',
      unwind: true,
    },
  ]);
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
