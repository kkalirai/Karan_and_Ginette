import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';

import { DatbaseModule } from 'src/providers/database/database.module';
import {
  RoleProvider,
  UserRoleProvider,
  userProviders,
} from '../auth/providers/user.provider';
import { PasswordService } from '../auth/services/password.services';
import {
  nutritionTypeProvider,
  SettingsProvider,
  WorkoutTypeProvider,
} from './providers/admin.provider';
import { UserManagementService } from './services/userManage.service';
import { SettingServices } from './services/settings.service';
import { EmailService } from 'src/providers/email/email.service';
import { NutritionService } from './services/nutritions.service';
import { WorkoutService } from './services/workout.service';
import { AuthService } from '../auth/services/auth.service';

@Module({
  controllers: [AdminController],
  providers: [
    UserManagementService,
    PasswordService,
    SettingServices,
    EmailService,
    AuthService,

    ...userProviders,
    ...RoleProvider,
    ...UserRoleProvider,
    ...nutritionTypeProvider,
    ...SettingsProvider,
    ...RoleProvider,
    NutritionService,
    WorkoutService,

    ...WorkoutTypeProvider,
  ],
  imports: [DatbaseModule],
})
export class AdminModule {}
