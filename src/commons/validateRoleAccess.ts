export function validateRoleAccess (roles = [], userRole: string) {
    let checkRole = false;
    for (let i = 0; i < roles.length; i++) {
        if (roles[i] === userRole) {
            checkRole = true;
            break;
        }
    }
    return checkRole;
};