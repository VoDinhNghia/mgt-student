import { collections } from 'src/constants/constants.collections.name';
import { lookupCommon } from './utils.lookup.query.aggregate-query';

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

export function studyProcessLookup() {
  const lookup = lookupCommon([
    {
      from: collections.profiles,
      localField: 'user',
      foreignField: '_id',
      as: 'user',
      unwind: true,
    },
    {
      from: collections.subject_registers,
      localField: '_id',
      foreignField: 'studyprocess',
      as: 'studyprocess',
      unwind: true,
    },
    {
      from: collections.subjects,
      localField: 'studyprocess.subject',
      foreignField: '_id',
      as: 'subject',
      unwind: true,
    },
  ]);
  const setAndGroup = [
    {
      $set: {
        'studyprocess.subject': '$subject',
      },
    },
    {
      $group: {
        _id: '$_id',
        user: { $first: '$user' },
        isDeleted: { $first: '$isDeleted' },
        studyprocess: { $push: '$studyprocess' },
      },
    },
  ];
  return [...lookup, ...setAndGroup];
}

export function subjectRegisterLookup() {
  const lookup = lookupCommon([
    {
      from: collections.subjects,
      localField: 'subject',
      foreignField: '_id',
      as: 'subject',
      unwind: true,
    },
    {
      from: collections.semesters,
      localField: 'subject.semester',
      foreignField: '_id',
      as: 'semester',
      unwind: true,
    },
  ]);
  const setAndGroup = [
    {
      $set: {
        'subject.semester': '$semester',
      },
    },
    {
      $group: {
        _id: '$_id',
        isDeleted: { $first: '$isDeleted' },
        statusRegister: { $first: '$statusRegister' },
        accumalatedPoint: { $first: '$accumalatedPoint' },
        essayScore: { $first: '$essayScore' },
        finalScore: { $first: '$finalScore' },
        midtermScore: { $first: '$midtermScore' },
        status: { $first: '$status' },
        subject: { $first: '$subject' },
      },
    },
  ];
  return [...lookup, ...setAndGroup];
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
