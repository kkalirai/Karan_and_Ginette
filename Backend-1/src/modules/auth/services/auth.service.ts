import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/modules/auth/dto/CreateUserDTO';
import { User } from 'src/modules/auth/entities/user.model';
import { PasswordService } from './password.services';
import { IPayloadUserJWT } from 'src/common/interfaces/interfaces';
import { EmailService } from 'src/providers/email/email.service';
import { Role, UserRole } from '../entities/role.model';
import { csvToArray } from 'src/utils/helper';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY') private userRepo: typeof User,
    @Inject('USERROLE_REPOSITORY') private userRoleRepo: typeof UserRole,
    @Inject('ROLE_REPOSITORY') private roleRepo: typeof Role,
    private passwordService: PasswordService,
    private emailService: EmailService,
  ) {}

  public async register(payload: CreateUserDTO) {
    try {
      console.log('🚀 ~ AuthService ~ register ~ payload:', payload);

      if (!payload.email && !payload.contact) {
        throw new HttpException(
          'Email or contact is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      let emailExistOrNotIn;
      if (payload.email) {
        emailExistOrNotIn = await this.userRepo.findOne({
          where: {
            email: payload.email,
          },
        });
      }

      let contactExistOrNotIn;
      if (payload.contact) {
        contactExistOrNotIn = await this.userRepo.findOne({
          where: {
            contact: payload.contact,
          } as any,
        });
      }
      if (contactExistOrNotIn && payload.contact) {
        throw new HttpException('Contact already exists', HttpStatus.CONFLICT);
      }

      if (emailExistOrNotIn && payload.email) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }

      if (payload.contact === '') {
        delete payload.contact;
        payload.contact = null;
      }

      const hashedPassword = await this.passwordService.encryptPassword(
        payload.password,
      );
      const newUser = await this.userRepo.create({
        email: payload.email,
        contact: payload.contact,
        firstName: payload.firstName,
        lastName: payload.lastName,
        isVerified: true,
        password: hashedPassword,
      });

      await this.userRoleRepo.create({
        userID: newUser.id,
        roleID: (await this.roleRepo.findOne({ where: { role: payload.role } }))
          .id,
      });

      // Function to send OTP on phone or email

      const otp = await this.passwordService.sendOTP({ userId: newUser.id });
      // const message = `${otp}`
      const message = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>OTP Verification</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);">
                    <h2 style="text-align: center; color: #333;">OTP Verification</h2>
                    <div style="text-align: center; margin-bottom: 20px;">
                        <p style="color: #555; font-size: 18px;">Your OTP code:</p>
                        <span style="display: inline-block; padding: 12px 20px; font-size: 24px; background-color: #007bff; color: #fff; border-radius: 5px;">${otp}</span>
                    </div>
                    <p style="text-align: center; color: #555;">Please use the above OTP code to verify your identity.</p>
                    <p style="text-align: center; color: #555;">This OTP is valid for a limited time only.</p>
                    <p style="text-align: center; color: #555;">If you didn't request this verification, please ignore this email.</p>
                </div>
            </body>
            </html>
            
            `;

      this.emailService.sendMail(newUser.email, message, 'Veirfy OTP!');
      return {
        message: 'User created',
        status: true,
        code: HttpStatus.CREATED,
        data: {
          userId: newUser.id,
          email: newUser.email,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  public async verifyUser(payload) {
    try {
      const user = await this.userRepo.findOne({
        where: {
          email: payload.email,
        },
      });
      if (!user) {
        throw new HttpException('Incorrect Email!', HttpStatus.BAD_REQUEST);
      }

      const otp = await user.otp;

      if (!otp) {
        throw new HttpException('OTP not found', HttpStatus.BAD_REQUEST);
      }

      const currentTime: any = new Date();
      const otpSendTime: any = new Date(user.otpSendTime);
      const diffMinutes = Math.floor((currentTime - otpSendTime) / (1000 * 60)); // Difference in minutes

      if (diffMinutes > 10) {
        throw new HttpException('OTP expired', HttpStatus.BAD_REQUEST);
      }

      if (otp !== payload.otp) {
        throw new HttpException('Incorrect OTP', HttpStatus.BAD_REQUEST);
      }

      user.isVerified = true;
      user.otp = '';
      user.noOfAttempts = 0;
      await user.save();
      const jwtPayload: IPayloadUserJWT = {
        userID: user.id,
      };

      const token = await this.passwordService.generateAccessToken(jwtPayload);
      const userRoleId = this.userRoleRepo.findOne({
        where: {
          userID: user.id,
        },
        attributes: ['roleID'],
        raw: true,
      });

      const userRole = await this.roleRepo.findByPk((await userRoleId).roleID, {
        attributes: ['role'],
      });
      let isFirstLogin = false;
      if (user.lastLogin === null) {
        isFirstLogin = true;
      }
      user.lastLogin = new Date();
      await user.save();

      return {
        message: 'User verified Successfully',
        status: true,
        code: HttpStatus.OK,
        data: {
          token: token,
          role: userRole.role,
          isFirstLogin: isFirstLogin,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  public async loginUser(userData) {
    try {
      if (!userData.email && !userData.contact) {
        throw new HttpException(
          'Email or contact No. Needed',
          HttpStatus.BAD_REQUEST,
        );
      }
      let user;
      if (userData.email) {
        user = await this.userRepo.findOne({
          where: { email: userData.email },
        });
        if (!user) {
          throw new HttpException(
            'Email address or password entered is incorrect',
            HttpStatus.NOT_FOUND,
          );
        }
      } else if (userData.contact) {
        user = await this.userRepo.findOne({
          where: { contact: userData.contact },
        });
        if (!user) {
          throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
        }
      }

      if (!user.isActive) {
        throw new HttpException(
          'Your account is disabled!',
          HttpStatus.BAD_REQUEST,
        );
      }
      console.log(
        '🚀 ~ AuthService ~ loginUser ~ user.isActive:',
        user.isActive,
      );

      if (!user.isVerified) {
        const res = await this.resentOTP({
          userId: user.id,
        });

        return {
          status: false,
          verified: false,
          code: HttpStatus.OK,
          message: res.message,
          data: {
            email: res.data.email,
            userId: res.data.id,
          },
        };
      }

      const isMatch = await this.passwordService.validatePassword(
        userData.password,
        user.password,
      );
      if (!isMatch) {
        throw new HttpException(
          'Email address or password entered is incorrect',
          HttpStatus.BAD_REQUEST,
        );
      }

      const payload: IPayloadUserJWT = {
        userID: user.id,
      };

      const token = await this.passwordService.generateAccessToken(payload);
      const userRoleId = this.userRoleRepo.findOne({
        where: {
          userID: user.id,
        },
        attributes: ['roleID'],
        raw: true,
      });

      const userRole = await this.roleRepo.findByPk((await userRoleId).roleID, {
        attributes: ['role'],
      });

      let isFirstLogin = false;
      if (user.lastLogin === null) {
        isFirstLogin = true;
      }
      user.lastLogin = new Date();
      await user.save();

      return {
        data: {
          token: token,
          role: userRole.role,
          isFirstLogin: isFirstLogin,
        },
        message: 'User LogIn Successfully',
        status: true,
        code: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  public async resentOTP(payload) {
    try {
      const user = await this.userRepo.findByPk(payload.userId);
      if (!user) {
        throw new HttpException('Incorrect UserID!', HttpStatus.BAD_REQUEST);
      }
      const otp = await this.passwordService.sendOTP(payload);
      const message = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>OTP Verification</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);">
                    <h2 style="text-align: center; color: #333;">OTP Verification</h2>
                    <div style="text-align: center; margin-bottom: 20px;">
                        <p style="color: #555; font-size: 18px;">Your OTP code:</p>
                        <span style="display: inline-block; padding: 12px 20px; font-size: 24px; background-color: #007bff; color: #fff; border-radius: 5px;">${otp}</span>
                    </div>
                    <p style="text-align: center; color: #555;">Please use the above OTP code to verify your identity.</p>
                    <p style="text-align: center; color: #555;">This OTP is valid for a limited time only.</p>
                    <p style="text-align: center; color: #555;">If you didn't request this verification, please ignore this email.</p>
                </div>
            </body>
            </html>`;

      this.emailService.sendMail(user.email, message, 'Verify OTP!');
      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Otp Sent Successfully',
        data: {
          email: user.email,
          id: user.id,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  public async resetPassword(resetPasswordData: any) {
    if (resetPasswordData.password !== resetPasswordData.confirmPassword) {
      throw new HttpException('Passwords Not Match', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepo.findByPk(resetPasswordData.userID);
    if (!user) {
      throw new HttpException('User Not Exists', HttpStatus.BAD_REQUEST);
    }

    user.isVerified = true;

    const hashedPassword = await this.passwordService.encryptPassword(
      resetPasswordData.password,
    );
    user.password = hashedPassword;
    await user.save();

    return {
      message: 'Password Updated Successfully',
      code: HttpStatus.OK,
      status: true,
    };
  }

  public async forgotPassword(forgotPasswordData) {
    try {
      if (!forgotPasswordData.email && !forgotPasswordData.contact) {
        throw new HttpException(
          'Email or contact required',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (forgotPasswordData.email) {
        const user = await this.userRepo.findOne({
          where: { email: forgotPasswordData.email },
        });

        if (!user) {
          throw new HttpException(
            'Email not registered!',
            HttpStatus.BAD_REQUEST,
          );
        }
        const otp = await this.passwordService.sendOTP({ userId: user.id });
        // const message = `${otp}`
        const message = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>OTP Verification</title>
                </head>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);">
                        <h2 style="text-align: center; color: #333;">OTP Verification</h2>
                        <div style="text-align: center; margin-bottom: 20px;">
                            <p style="color: #555; font-size: 18px;">Your OTP code:</p>
                            <span style="display: inline-block; padding: 12px 20px; font-size: 24px; background-color: #007bff; color: #fff; border-radius: 5px;">${otp}</span>
                        </div>
                        <p style="text-align: center; color: #555;">Please use the above OTP code to verify your identity.</p>
                        <p style="text-align: center; color: #555;">This OTP is valid for a limited time only.</p>
                        <p style="text-align: center; color: #555;">If you didn't request this verification, please ignore this email.</p>
                    </div>
                </body>
                </html>`;

        this.emailService.sendMail(user.email, message, 'Verify OTP!');
        return {
          message: 'OTP sent successfully',
          code: HttpStatus.OK,
          status: true,
          data: {
            email: user.email,
            id: user.id,
          },
        };
      } else if (forgotPasswordData.contact) {
        const user = await this.userRepo.findOne({
          where: { contact: forgotPasswordData.contact },
        });

        if (!user) {
          throw new HttpException('Incorrect Contact!', HttpStatus.BAD_REQUEST);
        }
        await this.passwordService.sendOTP({ userId: user.id });
        return {
          message: 'OTP sent successfully',
          status: true,
          code: HttpStatus.OK,
          data: {
            userId: user.id,
            email: user.email,
          },
        };
      }
    } catch (error) {
      throw error;
    }
  }

  public async socialLoginUser(payload) {
    try {
      const isExistingEmail = await this.userRepo.findOne({
        where: {
          email: payload.email,
        },
        raw: true,
        attributes: ['id'],
      });
      console.log(
        '🚀 ~ AuthService ~ socialLoginUser ~ isExistingEmail:',
        isExistingEmail,
      );
      if (isExistingEmail) {
        const token = await this.passwordService.generateAccessToken({
          userID: isExistingEmail.id,
        });
        const userRoleId = await this.userRoleRepo.findOne({
          where: {
            userID: isExistingEmail.id,
          },
          attributes: ['roleID'],
          raw: true,
        });
        console.log(
          '🚀 ~ AuthService ~ socialLoginUser ~ userRoleId:',
          userRoleId,
        );

        const userRole = await this.roleRepo.findByPk(
          (await userRoleId).roleID,
          {
            attributes: ['role'],
          },
        );

        return {
          data: {
            token: token,
            role: userRole.role,
          },
          message: 'User LoggedIn Successfully',
          status: true,
          code: HttpStatus.OK,
        };
      }

      let user;
      const existingOrNot = await this.userRepo.findOne({
        where: {
          socialId: payload.socialId,
          socialProvider: payload.socialProvider,
        },
      });

      if (!existingOrNot) {
        if (!payload.email) {
          throw new HttpException(
            'Something Went Wrong!!',
            HttpStatus.BAD_REQUEST,
          );
        }

        const isExistingEmail = await this.userRepo.findOne({
          where: {
            email: payload.email,
          },
        });

        if (isExistingEmail) {
          throw new HttpException(
            'Email Already Exists',
            HttpStatus.BAD_REQUEST,
          );
        }

        user = await this.userRepo.create({
          firstName: payload?.firstName,
          lastName: payload?.lastName,
          ...payload,
        });
        console.log('🚀 ~ AuthService ~ socialLoginUser ~ user:', user);

        await this.userRoleRepo.create({
          userID: user.id,
          roleID: 3,
        });
      } else {
        user = existingOrNot;
      }

      const jwtPayload: IPayloadUserJWT = {
        userID: user.id,
      };

      const token = await this.passwordService.generateAccessToken(jwtPayload);

      return {
        data: {
          token: token,
          role: 'user',
        },
        message: 'User LoggedIn Successfully',
        status: true,
        code: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  public async verifyOTP(payload) {
    try {
      const user = await this.userRepo.findOne({
        where: {
          email: payload.email,
        },
      });
      if (!user) {
        throw new HttpException('Incorrect Email!', HttpStatus.NOT_FOUND);
      }

      if (!user.otp) {
        throw new HttpException('OTP not found', HttpStatus.BAD_REQUEST);
      }

      const currentTime: any = new Date();
      const otpSendTime: any = new Date(user.otpSendTime);
      const diffMinutes = Math.floor((currentTime - otpSendTime) / (1000 * 60)); // Difference in minutes

      if (diffMinutes > 10) {
        throw new HttpException('OTP expired', HttpStatus.BAD_REQUEST);
      }

      if (payload.otp !== user.otp) {
        throw new HttpException('Incorrect OTP', HttpStatus.BAD_REQUEST);
      }

      user.otp = '';
      user.noOfAttempts = 0;
      await user.save();

      const jwtPayload: IPayloadUserJWT = {
        userID: user.id,
      };

      const token = await this.passwordService.generateAccessToken(jwtPayload);

      return {
        message: 'OTP verified',
        status: true,
        code: HttpStatus.OK,
        data: {
          token: token,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  public async updateProfile(payload, id) {
    console.log('🚀 ~ AuthService ~ updateProfile ~ payload:', payload);
    try {
      const user = await this.userRepo.findByPk(id);
      if (!user) {
        throw new HttpException('Invalid UserID.', HttpStatus.UNAUTHORIZED);
      }

      const {
        fitnessGoal,
        nutritionGoal,
        dietType,
        firstName,
        lastName,
        password,
        calorieRange,
        preferredWorkoutDuration,
        preferredIntensity,
      } = payload;

      let hashedPassword;
      if (payload.password) {
        hashedPassword = await this.passwordService.encryptPassword(
          payload.password,
        );
        user.password = hashedPassword;
      }

      await this.userRepo.update(
        {
          ...(nutritionGoal && { nutritionGoal }),
          ...(firstName && { firstName }),
          ...(dietType && { dietType }),
          ...(password && { password: hashedPassword }),
          ...(calorieRange && { calorieRange }),
          ...(preferredIntensity && { preferredIntensity }),
          ...(preferredWorkoutDuration && { preferredWorkoutDuration }),
          ...(lastName && { lastName }),
          ...(fitnessGoal && { fitnessGoal }),
        },
        {
          where: {
            id: id,
          },
        },
      );

      if (payload.location) {
        user.location = payload.location;
      }

      user.about = payload.about;

      if (payload.profile) {
        user.profile = payload.profile;
      }

      if (!payload.mobile) {
        user.contact = null;
      } else {
        user.contact = payload.mobile;
      }

      await user.save();

      return {
        code: HttpStatus.OK,
        status: true,
        message: 'Profile updated Successfully.',
      };
    } catch (error) {
      throw error;
    }
  }

  public async changePassword(payload) {
    try {
      const user = await this.userRepo.findByPk(payload.userID);
      if (!user) {
        throw new HttpException('Invalid UserID', HttpStatus.BAD_REQUEST);
      }

      const isMatch = await this.passwordService.validatePassword(
        payload.oldPassword,
        user.password,
      );
      if (!isMatch) {
        throw new HttpException(
          'Incorrect Old Password',
          HttpStatus.BAD_REQUEST,
        );
      }

      const hashedPassword = await this.passwordService.encryptPassword(
        payload.newPassword,
      );
      user.password = hashedPassword;
      await user.save();
      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Password Changed Successfully.',
      };
    } catch (error) {
      throw error;
    }
  }

  public async getDetails(userID) {
    try {
      const user = await this.userRepo.findByPk(userID, {
        raw: true,
      });
      if (!user) {
        throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
      }

      if (user.profile) {
        const profile = user.profile.replace('public', 'img');
        delete user.profile;
        user['profile'] = profile;
      }

      user['mobile'] = user.contact;
      delete user.contact;
      if (user.healthIssues) {
        const healthIssues = await csvToArray(user.healthIssues);
        user['healthIssues'] = healthIssues;
      }
      const role = await this.userRoleRepo.findOne({
        where: {
          userID: user.id,
        },
      });

      const userRole = await this.roleRepo.findByPk(role.roleID);
      console.log('🚀 ~ AuthService ~ getDetails ~ user:', user);

      return {
        status: true,
        code: HttpStatus.OK,
        data: {
          user,
          role: userRole.role,
        },
        message: 'Fetched',
      };
    } catch (error) {
      throw error;
    }
  }
}
