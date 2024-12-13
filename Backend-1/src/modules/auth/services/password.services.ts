import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IPayloadUserJWT } from 'src/common/interfaces/interfaces';
import { jwtDecode } from 'jwt-decode';
import { generateOTP } from 'src/utils/helper';
import { User } from '../entities/user.model';
// import { jwtConstants } from "src/common/constants/JWTConstants";
@Injectable()
export class PasswordService {
  constructor(
    @Inject('USER_REPOSITORY') private userRepo: typeof User,
    private jwtService: JwtService,
  ) {}

  public async validatePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  public async encryptPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  public async generateAccessToken(payload: IPayloadUserJWT) {
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '90d',
    });
    return token;
  }

  public async generateRefreshToken(payload: IPayloadUserJWT) {
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '90d',
    });
    return token;
  }

  public async gettingDataFromToken(token: string) {
    const decoded: IPayloadUserJWT = jwtDecode(token);
    return { id: decoded.userID };
  }

  public async validateToken(token: string) {
    try {
      await this.jwtService.verifyAsync(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  public async sendOTP(payload) {
    try {
      const otp = generateOTP();
      const user = await this.userRepo.findByPk(payload.userId);
      if (!user) {
        throw new HttpException('User Not Found', HttpStatus.BAD_REQUEST);
      }
      console.log(user);

      const lastSendTime: any = user.otpSendTime;
      const currentTime: any = new Date();
      const timeDifference = currentTime - lastSendTime;
      const hoursDifference = timeDifference / (1000 * 60 * 60);

      if (hoursDifference < 24 && user.noOfAttempts > 5) {
        throw new HttpException(
          'Your maximum OTP limit has been reached for the last 24 hours.',
          HttpStatus.BAD_REQUEST,
        );
      }

      user.otp = otp;
      user.noOfAttempts += 1;
      user.otpSendTime = new Date();
      await user.save();

      return otp;
    } catch (error) {
      throw error;
    }
  }
}
