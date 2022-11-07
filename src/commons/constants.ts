export const roles = {
    ADMIN: 'ADMIN',
    STUDENT: 'STUDENT',
    LECTURER: 'LECTURER',
    LIBRARIAN: 'LIBRARIAN'
}

export const rolesEnum = ['ADMIN', 'STUDENT', 'LECTURER', 'LIBRARIAN'];

export const permission = {
    FULL: ['ADMIN', 'STUDENT', 'LECTURER', 'LIBRARIAN'],
    LECTURER: ['ADMIN', 'LECTURER'],
    STUDENT: ['ADMIN', 'LECTURER', 'STUDENT'],
    LIBRARIAN: ['ADMIN', 'LIBRARIAN'],
    ADMIN: ['ADMIN'],
}

export const statusUser = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
}

export const typeAward = {
    PERSONAL: 'PERSONAL',
    GROUP: 'GROUP',
    FACULTY: 'FACULTY',
    CLASS: 'CLASS',
    MAJORS: 'MAJORS',
    UNIVERSITY: 'UNIVERSITY',
}

export const typeNews = {
    FACULTY: 'FACULTY',
    CLASS: 'CLASS',
    MAJORS: 'MAJORS',
    UNIVERSITY: 'UNIVERSITY',
    ENROLLMENT: 'ENROLLMENT', // enrollment information
}

export const statusStudent = {
    STILL: 'STILL',
    GRAD: 'GRADUATE',
    RESERVE: 'RESERVE',
    LEAVE: 'LEAVE',
}

export const libraryServiceType = {
    BORROW_BOOK: 'BORROW_BOOK',
    BORROW_MAGAZINE: 'BORROW_MAGAZINE',
    BORROW_ROOM: 'BORROW_ROOM',
    RESERVE_SEAT: 'RESERVE_SEAT'
}

export const typePayments = {
    payments: {
        CASH: 'CASH',
        ONLINE: 'ONLINE',
    },
    status: {
        PAID: 'PAID',
        OWED: 'OWED'
    }
}