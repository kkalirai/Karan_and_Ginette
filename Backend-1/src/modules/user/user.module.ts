import { Module } from '@nestjs/common';
import { userController } from './controllers/user.controller';
import { DatbaseModule } from 'src/providers/database/database.module';
import { PasswordService } from '../auth/services/password.services';
import {
  RoleProvider,
  UserRoleProvider,
  userProviders,
} from '../auth/providers/user.provider';
import { UserManagementService } from '../admin/services/userManage.service';
import { EmailService } from 'src/providers/email/email.service';
import {
  nutritionTypeProvider,
  WorkoutTypeProvider,
} from '../admin/providers/admin.provider';

@Module({
  controllers: [userController],
  providers: [
    ...userProviders,
    PasswordService,
    ...UserRoleProvider,
    ...nutritionTypeProvider,
    ...WorkoutTypeProvider,
    EmailService,
    UserManagementService,
    ...RoleProvider,
  ],
  imports: [DatbaseModule],
})
export class UserModule {}
