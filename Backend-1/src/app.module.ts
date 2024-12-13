/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatbaseModule } from './providers/database/database.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from './providers/email/email.module';
import { AdminModule } from './modules/admin/admin.module';
import { UserModule } from './modules/user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join, extname } from 'path';
import { Dialect } from 'sequelize';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'], // Optional: specify the path to your .env file
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/img',
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

    AuthModule,
    DatbaseModule,

    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),

    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_SERVER,
        auth: {
          user: process.env.SMTP_LOGIN,
          pass: process.env.SMTP_PASSWORD,
        },
      },
    }),
    EmailModule,
    AdminModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
