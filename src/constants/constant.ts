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

export const keyAccessBlogService = 'blog-service-access-backend_@mgt-student';

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

export const passwordDefault = '123Code#';

export enum EmimetypeAttachment {
  IMAGE = 'image/jpeg',
}

export enum EtypeLearningRate {
  TEN_POINT_SCALE = 'TEN_POINT_SCALE',
  FOUR_POINT_SCALE = 'FOUR_POINT_SCALE',
  POINT_TRAINNING = 'POINT_TRAINNING',
}

export enum EtypeSettingSubjectPass {
  FINAL_EXAM_POINT = 'FINAL_EXAM_POINT',
  ACCUMULATED_POINT = 'ACCUMULATED_POINT',
}

export enum EtypeVolunteeProgram {
  UNIVERSITY = 'UNIVERSITY',
  FACULTY = 'FACULTY',
}

export const lengthRandomCodeVoluntee = 3;

export enum EtypeAttendance {
  MANUAL = 'MANUAL',
  FACE_RECOGNITION = 'FACE_RECOGNITION',
  BIOMETRIC = 'BIOMETRIC',
}

export enum EtypeDegree {
  AVERAGE = 'AVERAGE',
  PRETTY = 'PRETTY',
  GOOD = 'GOOD',
  EXCELLENT = 'EXCELLENT',
}

export enum EtypeStatusSubjectStudy {
  PASS = 'PASS',
  FAILED = 'FAILED',
}
