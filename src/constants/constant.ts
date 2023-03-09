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

export const keyAccessLibraryService = 'libraries-access-key-secrect';

export const keyAccessCourseService = 'course-access-key-secrect';

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

export const linkAccessService = {
  COURSE: 'http://localhost:3003',
  LIBRARY: 'http://localhost:3002',
  ATTENDANCE: 'http://localhost:3001',
  ADMIN_FRONTEND: 'http://localhost:8000',
  FRONTEND: 'http://localhost:8001',
  LIBRARY_FRONTEND: 'http://localhost:8002',
};

export const trainningPointDefault = 60;

export const considerConditionScholarshipPoint = 6.5;

export const urlAccessImageLocal = 'http://localhost:3000/attachments';

export enum Epermission {
  ONLY_VIEW = 'ONLY_VIEW',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  ADD = 'ADD',
}

export const expiresInJwt = '7d';
