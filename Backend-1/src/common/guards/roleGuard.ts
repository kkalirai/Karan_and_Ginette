import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserRole } from 'src/modules/auth/entities/role.model';
import { User } from 'src/modules/auth/entities/user.model';
import { PasswordService } from 'src/modules/auth/services/password.services';

@Injectable()
export class isInstructorGuard implements CanActivate {
  constructor(
    @Inject('USER_REPOSITORY') private userRepo: typeof User,
    @Inject('USERROLE_REPOSITORY') private userRoleRepo: typeof UserRole,
    private passwordService: PasswordService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorizationHeader = request.headers.authorization;
    const token = authorizationHeader.split('Bearer ')[1];
    const { id } = await this.passwordService.gettingDataFromToken(token);

    const isInstructor = await this.userRoleRepo.findOne({
      where: {
        userID: id,
      },
      raw: true,
    });

    if (
      isInstructor.roleID === 4 ||
      isInstructor.roleID === 1 ||
      isInstructor.roleID === 2
    ) {
      request.instrucorData = {
        instructorID: id,
      };
      return Promise.resolve(true);
    }
    throw new HttpException(
      "You're not authorized for this route",
      HttpStatus.UNAUTHORIZED,
    );
  }
}

@Injectable()
export class isUserGuard implements CanActivate {
  constructor(
    @Inject('USER_REPOSITORY') private userRepo: typeof User,
    @Inject('USERROLE_REPOSITORY') private userRoleRepo: typeof UserRole,
    private passwordService: PasswordService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorizationHeader = request.headers.authorization;
    const token = authorizationHeader.split('Bearer ')[1];
    const { id } = await this.passwordService.gettingDataFromToken(token);

    // Now check if the user is a instructor or not
    const isUser = await this.userRoleRepo.findOne({
      where: {
        userID: id,
      },
    });

    if (isUser.roleID !== 3) {
      throw new HttpException(
        "You're not authorized for this route",
        HttpStatus.UNAUTHORIZED,
      );
    }

    request.userData = {
      userID: id,
    };
    return Promise.resolve(true);
  }
}

@Injectable()
export class isSuperAdminGuard implements CanActivate {
  constructor(
    @Inject('USER_REPOSITORY') private userRepo: typeof User,
    @Inject('USERROLE_REPOSITORY') private userRoleRepo: typeof UserRole,
    private passwordService: PasswordService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorizationHeader = request.headers.authorization;
    const token = authorizationHeader.split('Bearer ')[1];
    const { id } = await this.passwordService.gettingDataFromToken(token);

    const isSuperAdmin = await this.userRoleRepo.findOne({
      where: {
        userID: id,
      },
    });

    if (isSuperAdmin.roleID !== 1 && isSuperAdmin.roleID !== 2) {
      throw new HttpException(
        "You're not authorized for this route",
        HttpStatus.UNAUTHORIZED,
      );
    }

    request.userData = {
      userID: id,
    };
    return Promise.resolve(true);
  }
}
