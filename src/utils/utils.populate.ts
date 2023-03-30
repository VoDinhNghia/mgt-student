export const selectAttachment = [
  '_id',
  'url',
  'originalname',
  'filename',
  'isDeleted',
];

export const selectUser = [
  '_id',
  'firstName',
  'lastName',
  'middleName',
  'user',
  'isDeleted',
  'avatar',
];

export const selectUnion = {
  image: ['_id', 'attachment', 'description', 'union', 'isDeleted'],
  member: ['_id', 'user', 'position', 'union'],
  user: selectUser,
  union: ['_id', 'nameUnit', 'isDeleted'],
};

export const selectScholarship = {
  semester: ['_id', 'name', 'year', 'isDeleted'],
  scholarship: [
    '_id',
    'name',
    'semester',
    'type',
    'content',
    'attachment',
    'percentTuition',
  ],
  user: selectUser,
};

export const selectSemester = ['_id', 'name', 'year', 'isDeleted'];

export const selectRoom = [
  '_id',
  'name',
  'type',
  'isDeleted',
  'status',
  'capacity',
  'divice',
];

export const selectAward = [
  '_id',
  'name',
  'time',
  'location',
  'type',
  'description',
  'isDeleted',
];

export const selectFaculty = [
  '_id',
  'name',
  'introduction',
  'foundYear',
  'isDeleted',
];

export const selectCountry = [
  '_id',
  'name',
  'flag',
  'countryId',
  'capital',
  'isDeleted',
];

export const selectDistrict = [
  '_id',
  'name',
  'phoneCode',
  'codename',
  'code',
  'isDeleted',
];

export const selectProvince = [...selectDistrict, 'capital'];

export const selectWard = [...selectDistrict];

export const selectMajor = [
  '_id',
  'name',
  'introduction',
  'foundYear',
  'isDeleted',
];

export const selectDegreelevel = ['_id', 'name', 'description', 'isDeleted'];

export const selectCourse = ['_id', 'name', 'year', 'total', 'isDeleted'];
