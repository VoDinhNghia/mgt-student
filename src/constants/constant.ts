export enum ErolesUser {
  SUPPER_ADMIN = 'SUPPER_ADMIN',
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  LECTURER = 'LECTURER',
  LIBRARIAN = 'LIBRARIAN',
  ACCOUNTANT = 'ACCOUNTANT',
  STAFF = 'STAFF',
}

export enum EstatusUser {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum EstatusUserProfile {
  STUDYING = 'STUDYING',
  GRADUATE = 'GRADUATE',
  SAVEING = 'SAVEING',
  RESERVE = 'RESERVE',
  LEAVE = 'LEAVE',
}

export enum EtypeAward {
  PERSONAL = 'PERSONAL',
  GROUP = 'GROUP',
  FACULTY = 'FACULTY',
  CLASS = 'CLASS',
  MAJORS = 'MAJORS',
  UNIVERSITY = 'UNIVERSITY',
}

export enum EtypeNews {
  FACULTY = 'FACULTY',
  CLASS = 'CLASS',
  MAJORS = 'MAJORS',
  UNIVERSITY = 'UNIVERSITY',
  ENROLLMENT = 'ENROLLMENT', // enrollment information
  DEPARTMENT = 'DEPARTMENT',
}

export enum EroomType {
  CLASS_ROOM = 'CLASS_ROOM',
  MEETING = 'MEETING',
  GROUP_STUDY = 'GROUP_STUDY',
  LIBRARIAN = 'LIBRARIAN',
  OFFICE_DEPARTMENT = 'OFFICE_DEPARTMENT',
}

export enum EtypePayments {
  CASH = 'CASH',
  ONLINE = 'ONLINE',
}

export enum EstatusPayments {
  PAID = 'PAID',
  OWED = 'OWED',
}

export const keyAccessLibraryService = 'Key_library_service_backend_private';

export const keyAccessStudyProcessService = 'course-access-key-secrect';

export enum EtypeLeaderSchool {
  PARTYCOMMITTEE = 'PARTY_COMMITTEE',
  SCHOOLBOARD = 'SCHOOL_BOARD',
  BOTH = 'BOTH', // Both of the above
}

export const schoolId = 'school-01';

export enum EscholarshirpType {
  EXCELLENCE = 'EXCELLENCE',
  GOOD = 'GOOD',
}

export enum EuserGender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export const trainningPointDefault = 60;

export const considerConditionScholarshipPoint = 6.5;

export enum Epermission {
  ONLY_VIEW = 'ONLY_VIEW',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  ADD = 'ADD',
}

export const expiresInJwt = '7d';

export const collectionNames = {
  users: 'users',
  profiles: 'profiles',
  admin_permissions: 'admin_permissions',
  attachments: 'attachments',
  awards: 'awards',
  blogs: 'blogs',
  branches: 'branches',
  centers: 'centers',
  class_infos: 'class_infos',
  config_condition_learning_ratings: 'config_condition_learning_ratings',
  config_condition_pass_subjects: 'config_condition_pass_subjects',
  countries: 'countries',
  courses: 'courses',
  degreelevels: 'degreelevels',
  department_staffs: 'department_staffs',
  departments: 'departments',
  districts: 'districts',
  faculties: 'faculties',
  institudes: 'institudes',
  leader_schools: 'leader_schools',
  majors: 'majors',
  money_per_credit_mgts: 'money_per_credit_mgts',
  news: 'news',
  payment_study_fees: 'payment_study_fees',
  provinces: 'provinces',
  rooms: 'rooms',
  scholarship_users: 'scholarship_users',
  scholarships: 'scholarships',
  school_infos: 'school_infos',
  semesters: 'semesters',
  study_processes: 'study_processes',
  subject_processes: 'subject_processes',
  subject_registers: 'subject_registers',
  subjects: 'subjects',
  trainning_points: 'trainning_points',
  unions: 'unions',
  voluntee_programs: 'voluntee_programs',
  wards: 'wards',
};
