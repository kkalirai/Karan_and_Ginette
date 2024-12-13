// auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt } from 'passport-jwt';
// import { UserService } from 'path-to-your-user-service'; // Import your user service
import { User } from 'src/modules/auth/entities/user.model';
import { PasswordService } from 'src/modules/auth/services/password.services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject('USER_REPOSITORY') private userRepo: typeof User,
    private passwordService: PasswordService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

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

    const user = await this.userRepo.findByPk(id);
    if (!user) {
      throw new HttpException(
        'No user found, Invalid Token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!user.isActive) {
      throw new HttpException(
        'Your account is disabled!',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return Promise.resolve(true);
  }
}
