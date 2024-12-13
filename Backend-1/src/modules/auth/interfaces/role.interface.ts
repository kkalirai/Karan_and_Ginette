import { RoleENUM } from 'src/common/enum/userRole.enum';

export interface RoleAttributes {
  role: RoleENUM;
  id: number;
}

export interface UserRoleAttributes {
  id: number;
  roleID: number;
  userID: number;
}
