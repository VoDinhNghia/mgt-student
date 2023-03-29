export const selectAttachment = [
  '_id',
  'url',
  'originalname',
  'filename',
  'isDeleted',
];

export const selectUnion = {
  image: ['_id', 'attachment', 'description', 'union', 'isDeleted'],
  member: ['_id', 'user', 'position', 'union'],
  user: ['_id', 'firstName', 'lastName', 'middleName', 'user', 'isDeleted'],
  union: ['_id', 'nameUnit', 'isDeleted'],
};

export const selectScholarship = {
  semester: ['_id', 'name', 'year', 'isDeleted'],
};
