import { User } from '../entities/user.model';
import { Role, UserRole } from '../entities/role.model';

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useValue: User,
  },
];

export const RoleProvider = [
  {
    provide: 'ROLE_REPOSITORY',
    useValue: Role,
  },
];

export const UserRoleProvider = [
  {
    provide: 'USERROLE_REPOSITORY',
    useValue: UserRole,
  },
];
