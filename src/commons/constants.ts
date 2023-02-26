export const roles = {
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT',
  LECTURER: 'LECTURER',
  LIBRARIAN: 'LIBRARIAN',
};

export enum ErolesEnum {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  LECTURER = 'LECTURER',
  LIBRARIAN = 'LIBRARIAN',
}

export const permission = {
  FULL: ['ADMIN', 'STUDENT', 'LECTURER', 'LIBRARIAN'],
  LECTURER: ['ADMIN', 'LECTURER'],
  STUDENT: ['ADMIN', 'LECTURER', 'STUDENT'],
  LIBRARIAN: ['ADMIN', 'LIBRARIAN'],
  ADMIN: ['ADMIN'],
};

export const roleTypeAccessApi = {
  FULL: 'FULL',
  LECTURER: 'LECTURER',
  STUDENT: 'STUDENT',
  LIBRARIAN: 'LIBRARIAN',
  ADMIN: 'ADMIN',
};

export const statusUser = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ENUM: ['ACTIVE', 'INACTIVE'],
};

export enum EtypeAward {
  PERSONAL = 'PERSONAL',
  GROUP = 'GROUP',
  FACULTY = 'FACULTY',
  CLASS = 'CLASS',
  MAJORS = 'MAJORS',
  UNIVERSITY = 'UNIVERSITY',
}

export const typeNews = {
  FACULTY: 'FACULTY',
  CLASS: 'CLASS',
  MAJORS: 'MAJORS',
  UNIVERSITY: 'UNIVERSITY',
  ENROLLMENT: 'ENROLLMENT', // enrollment information
};

export enum EroomType {
  CLASS_ROOM = 'CLASS_ROOM',
  MEETING = 'MEETING',
  GROUP_STUDY = 'GROUP_STUDY',
  LIBRARIAN = 'LIBRARIAN',
}

export const typePayments = {
  payments: {
    CASH: 'CASH',
    ONLINE: 'ONLINE',
  },
  status: {
    PAID: 'PAID',
    OWED: 'OWED',
  },
};

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
