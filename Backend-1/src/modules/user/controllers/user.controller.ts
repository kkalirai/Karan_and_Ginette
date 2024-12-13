import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/authGuards';
import { isUserGuard } from 'src/common/guards/roleGuard';
import { UserManagementService } from 'src/modules/admin/services/userManage.service';

@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard, isUserGuard)
export class userController {
  constructor(private userManagerServiceAdmin: UserManagementService) {}

  @Get('get-user-details')
  async getUserDetails(@Req() request: any) {
    const userID = request.userData.userID;
    const response =
      await this.userManagerServiceAdmin.getUserDetailById(userID);
    return response;
  }
}
