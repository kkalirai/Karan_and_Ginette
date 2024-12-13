/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Req,
  UseFilters,
  HttpStatus,
  HttpException,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';

import { AuthService } from 'src/modules/auth/services/auth.service';

import {
  CreateUserDTO,
  resendOTPDTO,
  verifyOTPDto,
} from 'src/modules/auth/dto/CreateUserDTO';

import { LoginUserDTO } from 'src/modules/auth/dto/LoginUserDTO';

import { ForgotPasswordDTO, ResetPasswordDTO } from '../dto/passwordDTO';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { ApiTags } from '@nestjs/swagger';
import { PasswordService } from '../services/password.services';
import { AuthGuard } from 'src/common/guards/authGuards';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/common/helpers/helper';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly passwordService: PasswordService,
  ) {}

  @Post('/register-user')
  @UsePipes(new ValidationPipe())
  async createUser(@Body() payload: CreateUserDTO) {
    if (!payload.role) {
      throw new HttpException(
        'Please send the User role in Headers',
        HttpStatus.BAD_REQUEST,
      );
    }
    const getData = await this.authService.register(payload);
    return getData;
  }

  @Post('verify-user')
  @UsePipes(new ValidationPipe())
  async verifyUser(@Body() payload: verifyOTPDto) {
    const response = await this.authService.verifyUser(payload);
    return response;
  }

  @Post('resend-otp')
  @UsePipes(new ValidationPipe())
  async sendOtp(@Body() payload: resendOTPDTO) {
    const response = await this.authService.resentOTP({
      userId: payload.userID,
    });
    return response;
  }

  @Post('/login')
  @UsePipes(new ValidationPipe())
  @UseFilters(new HttpExceptionFilter())
  async loginUser(@Body() payload: LoginUserDTO) {
    try {
      console.log(payload);
      const loginData = await this.authService.loginUser(payload);
      return loginData;
    } catch (error) {
      throw error;
    }
  }

  @Post('/reset-password')
  async resetPassword(
    @Body() resetPasswordData: ResetPasswordDTO,
    @Req() request: any,
  ) {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      throw new HttpException(
        'No authorization header',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = authorizationHeader.split('Bearer ')[1];
    if (!token) {
      throw new HttpException('No token', HttpStatus.UNAUTHORIZED);
    }

    const isTokenValid = await this.passwordService.validateToken(token);

    if (!isTokenValid) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }

    const { id } = await this.passwordService.gettingDataFromToken(token);
    if (!id) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }

    resetPasswordData['userID'] = id;

    const resetData = await this.authService.resetPassword(resetPasswordData);
    return resetData;
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(@Body() payload: any, @Req() request: any) {
    if (!payload.oldPassword || !payload.newPassword) {
      throw new HttpException(
        'Validation Error',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      throw new HttpException(
        'No authorization header',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = authorizationHeader.split('Bearer ')[1];
    if (!token) {
      throw new HttpException('No token', HttpStatus.UNAUTHORIZED);
    }

    const isTokenValid = await this.passwordService.validateToken(token);

    if (!isTokenValid) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }

    const { id } = await this.passwordService.gettingDataFromToken(token);
    if (!id) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }
    payload['userID'] = id;

    const response = await this.authService.changePassword(payload);
    return response;
  }

  @Post('/forgot-password')
  @UsePipes(new ValidationPipe())
  async ForgotPassword(@Body() forgotPasswordData: ForgotPasswordDTO) {
    return await this.authService.forgotPassword(forgotPasswordData);
  }

  @Post('verify-otp')
  @UsePipes(new ValidationPipe())
  async verifyOTP(@Body() payload: verifyOTPDto) {
    return await this.authService.verifyOTP(payload);
  }

  @Post('update-details')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'profile', maxCount: 1 }], {
      storage: storage,
    }),
  )
  @UsePipes(new ValidationPipe())
  async updateProfile(
    @Req() request: any,
    @Body() payload: any,
    @UploadedFiles() files: { profile?: Express.Multer.File[] },
  ) {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      throw new HttpException(
        'No authorization header',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = authorizationHeader.split('Bearer ')[1];
    if (!token) {
      throw new HttpException('No token', HttpStatus.UNAUTHORIZED);
    }

    const isTokenValid = await this.passwordService.validateToken(token);

    if (!isTokenValid) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }

    const { id } = await this.passwordService.gettingDataFromToken(token);
    if (!id) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }

    let profilePath = '';

    if (files && files.profile && files.profile.length > 0) {
      profilePath = files.profile[0].path;
    }
    payload['profile'] = profilePath;

    const response = await this.authService.updateProfile(payload, id);
    return response;
  }

  @Get('get-details')
  async getDetails(@Req() request: any) {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      throw new HttpException(
        'No authorization header',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = authorizationHeader.split('Bearer ')[1];
    if (!token) {
      throw new HttpException('No token', HttpStatus.UNAUTHORIZED);
    }

    const isTokenValid = await this.passwordService.validateToken(token);

    if (!isTokenValid) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }

    const { id } = await this.passwordService.gettingDataFromToken(token);
    if (!id) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }

    return await this.authService.getDetails(id);
  }
}
