/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { DatbaseModule } from 'src/providers/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import {
  RoleProvider,
  UserRoleProvider,
  userProviders,
} from './providers/user.provider';
import { PasswordService } from './services/password.services';
import { EmailService } from 'src/providers/email/email.service';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';

@Module({
  controllers: [AuthController],

  providers: [
    AuthService,
    PasswordService,
    EmailService,
    ...UserRoleProvider,
    ...userProviders,
    ...RoleProvider,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],

  imports: [
    DatbaseModule,
    JwtModule.register({
      global: true,
      secret: 'MysecretKey',
      signOptions: { expiresIn: '1800s' },
    }),
  ],
})
export class AuthModule {}
