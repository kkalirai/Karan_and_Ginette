/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { SeederService } from './Seeder.service';
import {
  nutritionTypeProvider,
  SettingsProvider,
  WorkoutTypeProvider,
} from '../admin/providers/admin.provider';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import { DatbaseModule } from 'src/providers/database/database.module';
import { ConfigModule } from '@nestjs/config';
import {
  RoleProvider,
  userProviders,
  UserRoleProvider,
} from '../auth/providers/user.provider';
import { PasswordService } from '../auth/services/password.services';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    SeederService,
    PasswordService,
    JwtService,
    ...WorkoutTypeProvider,
    ...nutritionTypeProvider,
    ...UserRoleProvider,
    ...RoleProvider,
    ...userProviders,
    ...SettingsProvider,
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'], // Optional: specify the path to your .env file
    }),
    SequelizeModule.forRoot({
      port: 3306,
      dialect: process.env.DATABASE_DILECT as Dialect,
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadModels: true,
      synchronize: true,
    }),
    DatbaseModule,
  ],
})
export class SeederModule {}
