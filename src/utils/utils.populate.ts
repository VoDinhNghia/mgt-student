export const selectAttachment = ['_id', 'url', 'originalname', 'filename'];

export const selectUnion = {
  image: ['_id', 'attachment', 'description', 'union'],
  member: ['_id', 'user', 'position', 'union'],
  user: ['_id', 'firstName', 'lastName', 'middleName', 'user', 'isDeleted'],
  union: ['_id', 'nameUnit'],
};
