export const msgServerError = 'Server interval';
export const msgNotFound = 'The document not found';
export const msgValidateEmail = 'Email not correct format';
export const msgEmailExisted = 'This email existed already';

export const userMsg = {
  create: 'Create user success',
  createLeaderSchool: 'Create leader school success',
  createUserProcessFailed: 'Can not create study process',
  getAll: 'Get all user success',
  getAllLeaderSchools: 'Get all leader school success',
  getByIdLeaderSchools: 'Get leader school by id success',
  getById: 'Get user by id success',
  update: 'Update user success',
  updateUserProfile: 'Update profile success',
  updateLeaderSchool: 'Update leader school success',
  delete: 'Delete user success',
  deleteLeaderSchool: 'Delete leader school success',
  notFoundUser: 'User not found',
  notFoundeaderSchool: 'Leader school not found',
  notFoundProfile: 'User profile not found',
  importUser: 'Import multi user success',
  importValidate:
    'email or passWord or role or firstName or lastName must provided.',
  importCreateUserFailed: 'Can not create user',
  importCreateProfileFailed: 'Can not create profile',
  importCreateStudyProcessFailed: 'Can not create study process',
  importStatus: 'Import user success',
  profileUserExisted: 'Profile of user existed already',
  leaderSchoolExisted: 'Leader school existed already',
  supperAdminExisted: 'Supper admin existed already',
};

export const unionMsg = {
  create: 'Create union success',
  createMember: 'Create union member success',
  createImage: 'Create union member success',
  notFound: 'Union not found',
  notFoundMember: 'Union member not found',
  notFoundImage: 'Union image not found',
  getAll: 'Get all unions success',
  getAllMembers: 'Get all union members success',
  getAllImages: 'Get all union images success',
  getById: 'Get union by id success',
  getByIdMember: 'Get union member by id success',
  getByIdImage: 'Get union image by id success',
  update: 'Update union success',
  updateMember: 'Update union member success',
  updateImage: 'Update union image success',
  delete: 'Delete union success',
  deleteMember: 'Delete union member success',
  deleteImage: 'Delete union image success',
};

export const attachmentMsg = {
  create: 'Create attachment success',
  getById: 'Get attachment success',
  delete: 'Delete attachment success',
  notFound: 'Attachment not found',
  getAll: 'Get all attachment success',
  getAllByUser: 'Get all attachment of user success',
};

export const semesterMsg = {
  create: 'Create semester success',
  getAll: 'Get all semester success',
  update: 'Update semester success',
  getById: 'Get semester by id success',
  delete: 'Delete semester success',
  notFound: 'Semester not found',
};

export const schoolMsg = {
  getSchoolInfo: 'Get all school success',
  update: 'Update school success',
  notFound: 'School not found',
};

export const syncServiceMsg = {
  migrateUsersLibrary: 'Sync data success',
  getAllUserSyncLibrary: 'Get all users success',
};

export const scholarshipMsg = {
  create: 'Create sholarship success',
  createUser: 'Create user scholarship success',
  update: 'Update scholarship success',
  getAll: 'Get all scholarship success',
  getAllUsers: 'Get all user scholarship success',
  getById: 'Get scholarship by id success',
  delete: 'Delete scholarship success',
  deleteUser: 'Delete scholarship user success',
  notFound: 'Scholarship not found',
  existedName: 'Scholarship name existed in semester already',
};

export const roomMsg = {
  create: 'Create room success',
  getAll: 'Get all room success',
  update: 'Update room success',
  getById: 'Get room by id success',
  delete: 'Delete room success',
  notFound: 'Room not found',
  existedName: 'Room name existed already',
};

export const permissionMsg = {
  create: 'Create permission success',
  getAll: 'Get all permission success',
  update: 'Update permission success',
  getById: 'Get permission by id success',
  delete: 'Delete permission success',
  notFound: 'Permission not found',
};

export const paymentMsg = {
  createMoneyCreditMgt: 'Create amount credit success',
  getAllMoneyCreditMgt: 'Get all amount credit success',
  updateMoneyCreditMgt: 'Update amount credit success',
  getByIdMoneyCreditMgt: 'Get amount credit by id success',
  createUserTuition: 'Create user tuition success',
  getAllUserTuition: 'Get user tuition success',
  notFound: 'Payment not found',
  notFoundUserPayment: 'User tuition not found',
  existedMoneyCreditMgt: 'Amount credit existed already',
};

export const newsMsg = {
  create: 'Create news success',
  getAll: 'Get all news success',
  update: 'Update news success',
  getById: 'Get news by id success',
  delete: 'Delete news success',
  notFound: 'News not found',
};

export const instituteMsg = {
  create: 'Create institute success',
  getAll: 'Get all institutes success',
  update: 'Update institute success',
  getById: 'Get institute by id success',
  delete: 'Delete institute success',
  notFound: 'Institute not found',
  notFoundParson: 'Parson not found',
  notFoundViceParson: 'ViceParson not found',
};

export const countriesMsg = {
  initCountries: 'Import multi countries success',
  getAllCountries: 'Get all countries success',
  getByIdCountry: 'Get country by id success',
  updateCountry: 'Update country success',
  initProvince: 'Import multi provinces success',
  getAllProvince: 'Get all provinces success',
  getAllDistrict: 'Get all districts success',
  initDistrict: 'Import multi districts success',
  initWard: 'Import multi wards success',
  getAllWard: 'Get all wards success',
  notfound: 'Country not found',
  notfoundProvince: 'Province not found',
  notfoundDistrict: 'District not found',
  notfoundWard: 'Ward not found',
  invalidFieldsInitCountry:
    'Failed - countryId or name or flag or capital must provided',
  createSuccess: 'Create country success',
  systemError: 'Failed - System error',
  validCountry: 'Failed - Country not found',
  validProvince: 'Failed - Province not found',
  validDistrict: 'Failed - District not found',
  createProvinceSuccess: 'Create province success',
  createDistrictSuccess: 'Create District success',
  createWardSuccess: 'Create wards success',
};

export const facultiesMsg = {
  create: 'Create faculty success',
  getAll: 'Get all faculties success',
  update: 'Update faculty success',
  getById: 'Get faculty by id success',
  delete: 'Delete faculty success',
  createMajor: 'Create major success',
  getAllMajor: 'Get all majors success',
  updateMajor: 'Update major success',
  getByIdMajor: 'Get major by id success',
  notFound: 'Faculty not found',
  notFoundMajor: 'Major not found',
  existedName: 'Faculty name existed already',
};

export const courseMsg = {
  create: 'Create course success',
  getAll: 'Get all courses success',
  update: 'Update course success',
  getById: 'Get course by id success',
  delete: 'Delete course success',
  notFound: 'Course not found',
  existedName: 'Course name existed already',
};

export const classMsg = {
  create: 'Create class success',
  update: 'Update class success',
  getById: 'Get class by id success',
  getAll: 'Get all classes success',
  getAllSubject: 'Get all subject success',
  createSubject: 'Create subject success',
  updateSubject: 'Update subject success',
  deleteSubject: 'Delete subject success',
  getByIdSubject: 'Get subject by id success',
  createSubjectProcessError: 'Can not create subject process',
  notFoud: 'Class not found',
  notFoundSubject: 'Subject not found',
  existedClassName: 'Class name existed already',
  validateTotalPercent:
    '[Validate] - Total of midTermTest, finalExam, studentEssay percent must eqal 100',
};

export const degreeLevelMsg = {
  create: 'Create degreelevel success',
  getAll: 'Get all degreelevels success',
  update: 'Update degreelevel success',
  getById: 'Get degreelevel by id success',
  delete: 'Delete degreelevel success',
  notFound: 'Degreelevel not found',
  existedName: 'Degreelevel name existed already',
};

export const departmentMsg = {
  create: 'Create department success',
  getAll: 'Get all departments success',
  update: 'Update department success',
  getById: 'Get department by id success',
  delete: 'Delete department success',
  createStaff: 'Create department staff success',
  createMultiStaff: 'Create department multi staff success',
  getAllStaff: 'Get all departments staff success',
  updateStaff: 'Update department staff success',
  getByIdStaff: 'Get department staff by id success',
  deleteStaff: 'Delete department staff success',
  notFound: 'Department not found',
  notFoundStaff: 'Staff not found',
};

export const centerMsg = {
  create: 'Create center success',
  getAll: 'Get all centers success',
  update: 'Update center success',
  getById: 'Get center by id success',
  delete: 'Delete center success',
  notFound: 'Center not found',
};

export const branchMsg = {
  create: 'Create branch success',
  getAll: 'Get all branchs success',
  update: 'Update branch success',
  getById: 'Get branch by id success',
  notFound: 'Branch not found',
  existedName: 'Branch name existed already',
  delete: 'Delete branch success',
};

export const awardMsg = {
  create: 'Create award success',
  update: 'Update award success',
  getById: 'Get award by Id sucess',
  getAll: 'Get all award success',
  delete: 'Delete award success',
  notFound: 'Award not found',
};

export const authMsg = {
  createSupperAdmin: 'Create supper admin success',
  login: 'Login sucess',
  getMe: 'Get me success',
  errorAuth: 'User or password incorrect',
};

export const settingMsg = {
  createSubjectPass: 'Create setting subject pass success',
  createLearningrate: 'Create setting learning rate success',
  updateSubjectPass: 'Update setting subject pass success',
  deleteSubjectPass: 'Delete setting subject pass success',
  getAllSubjectPass: 'Get all setting subject pass success',
  getByIdSubjectPass: 'Get setting subject pass success',
  updateLearningRate: 'Update setting learning rate success',
  deleteLearningRate: 'Delete setting learning rate success',
  getAllLearningRate: 'Get all setting learning rate success',
  getByIdLearningRate: 'Get setting learning rate success',
  notFoundSubjectPass: 'Setting subject not found',
  notFoundLearningRate: 'Setting learning rate not found',
};

export const trainningPointMsg = {
  createTrainningPoint: 'Create trainning point success',
  updateTrainningPoint: 'Update trainning point success',
  getAllTrainningPoint: 'Get all trainning point success',
  getByIdTrainningPoint: 'Get trainning point by id success',
  deleteTrainningPoint: 'Delete trainning point success',
  createVoluntee: 'Create voluntee success',
  updateVoluntee: 'Update voluntee success',
  getAllVoluntee: 'Get all voluntee success',
  getByIdVoluntee: 'Get voluntee by id success',
  deleteVoluntee: 'Delete voluntee success',
  importTraingPoint: 'Import trainning point success',
  importVolunteeProgram: 'Import voluntee program success',
  validateVoluntee:
    'Failed - title or location or startDate or endDate or type must provided',
  validateDate: 'Failed - startDate or endDate incorect format',
  validateLeader: 'Failed - Leader not found',
  validateSecretary: 'Failed - secretary not found',
  statusImportVoluntee: 'Success - create voluntee program success',
  statusImportTrainningPoint: 'Success - create trainning point success',
  sysError: 'Failed - system error',
  notFoundVoluntee: 'Voluntee not found',
  notFoundTrainningPoint: 'Trainning point not found',
};

export const descriptionMsg = {
  apiLogin: 'Response data when login success',
};
