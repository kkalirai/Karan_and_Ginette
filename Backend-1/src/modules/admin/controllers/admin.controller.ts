/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserManagementService } from '../services/userManage.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SettingServices } from '../services/settings.service';
import { isSuperAdminGuard } from 'src/common/guards/roleGuard';
import { AuthGuard } from 'src/common/guards/authGuards';
import { imageFileFilter, storage } from 'src/common/helpers/helper';
import { createAdminDTO } from '../dto/userDTO';
import { NutritionService } from '../services/nutritions.service';
import { WorkoutService } from '../services/workout.service';
import { createNutritionDTO, updateNutritionDTO } from '../dto/nutrition.dto';
import { CreateWorkoutDTO, UpdateWorkoutDTO } from '../dto/workout.dto';
import { AuthService } from 'src/modules/auth/services/auth.service';

@Controller('administrator')
export class AdminController {
  constructor(
    private UserManagementService: UserManagementService,
    private settingService: SettingServices,
    private nutritionService: NutritionService,
    private workoutService: WorkoutService,
    private readonly authService: AuthService,
  ) {}

  @Get('count')
  async getCount() {
    return {
      status: true,
      code: HttpStatus.OK,
      data: {
        Clients: 15,
        Instructors: 9,
        Workouts: 34,
        Nutritions: 13,
      },
    };
  }

  @Get('get-details/:id')
  async getUserDetails(@Param() params: { id: any }): Promise<unknown> {
    const response = await this.authService.getDetails(params.id);

    return {
      status: true,
      code: HttpStatus.OK,
      data: {
        ...response.data.user,
        role: response.data.role,
      },
      message: 'Fetched',
    };
  }

  @Get('admin-list')
  async getAdminList(@Query() queries: any) {
    const { pageNumber, pageLength, sortKey, sortOrder } = queries;

    if (!pageNumber || !pageLength || !sortOrder || !sortKey) {
      throw new HttpException(
        'Both Sorting Order, Sorting Key, pageNumber and pageLength are required.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!['id', 'firstName', 'lastName', 'email'].includes(sortKey)) {
      throw new HttpException(
        'Invalid sort key. Allowed values are "id", "name", "email", or "status".',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!['asc', 'desc'].includes(sortOrder)) {
      throw new HttpException(
        'Invalid sorting order. Allowed values are asc and desc.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const parsedPageNumber = parseInt(pageNumber, 10);
    const parsedPageLength = parseInt(pageLength, 10);
    if (isNaN(parsedPageLength) || isNaN(parsedPageNumber)) {
      throw new HttpException(
        'Invalid pageNumber or pageLength',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (parsedPageNumber <= 0) {
      throw new HttpException(
        'PageNumber must be positive',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (parsedPageLength <= 0) {
      throw new HttpException(
        'Pagelength must be positive.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const response = await this.UserManagementService.getAllAdmins(
      queries.pageNumber,
      queries.pageLength,
      queries.sortKey,
      queries.sortOrder,
      queries.searchKey,
      queries.role,
    );
    return response;
  }

  @Get('admin-csv-data')
  async getAdminCSVData(@Res() res: any) {
    try {
      const response = await this.UserManagementService.getCSVData();
      const fileName = `user-lists-${'testst'}.xlsx`;
      res.attachment(fileName);
      return res.send(response);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard, isSuperAdminGuard)
  @Post('change-status/:userID')
  @UseGuards(AuthGuard, isSuperAdminGuard)
  async changeActivityStatus(@Param() payload: any) {
    if (!payload.userID) {
      throw new HttpException('UserID is required.', HttpStatus.BAD_REQUEST);
    }
    const response = await this.UserManagementService.changeActiveStatus(
      payload.userID,
    );
    return response;
  }

  @Post('update-admin/:userID')
  @UseGuards(AuthGuard, isSuperAdminGuard)
  async updateAdmin(@Param() params: any, @Body() payload: any) {
    if (!params.userID) {
      throw new HttpException('No UserID', HttpStatus.BAD_REQUEST);
    }

    if (!payload.firstName || !payload.lastName || !payload.gender) {
      throw new HttpException(
        'Firstname and lastname is required.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const response = await this.UserManagementService.UpdateUser(
      params.userID,
      payload,
    );
    return response;
  }

  @UseGuards(AuthGuard, isSuperAdminGuard)
  @Delete('delete-admin/:userID')
  @UseGuards(AuthGuard, isSuperAdminGuard)
  async deleteAdmin(@Param() params: any) {
    if (!params.userID) {
      throw new HttpException('UserId required', HttpStatus.BAD_REQUEST);
    }

    const response = await this.UserManagementService.deleteUser(params.userID);

    return response;
  }

  @UseGuards(AuthGuard, isSuperAdminGuard)
  @Post('change-status/:userID')
  @UseGuards(AuthGuard, isSuperAdminGuard)
  async changeStatus(@Param() params: any) {
    if (!params.userID) {
      throw new HttpException('UserId required', HttpStatus.BAD_REQUEST);
    }
    const response = await this.UserManagementService.ChangeUserActivityStatus(
      params.userID,
    );
    return response;
  }

  @UseGuards(AuthGuard, isSuperAdminGuard)
  @Post('create-admin')
  @UseGuards(AuthGuard, isSuperAdminGuard)
  async createAdmin(@Body() payload: createAdminDTO) {
    const response = await this.UserManagementService.createNewAdmin(payload);
    return response;
  }

  // Branding Apis--
  @Post('update-settings')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'logo', maxCount: 1 },
        { name: 'banner', maxCount: 1 },
      ],
      { storage: storage, fileFilter: imageFileFilter },
    ),
  )
  async addBranding(
    @UploadedFiles()
    files: { logo?: Express.Multer.File[]; banner?: Express.Multer.File[] },
    @Body() data: any,
  ) {
    const logoPath = files.logo?.[0]?.path;
    const bannerPath = files.banner?.[0]?.path;

    const payload = {
      font: data.font,
      primaryColor: data.primaryColor,
      banner: bannerPath,
      logo: logoPath,
      moduleName: data.moduleName,
    };
    const response = await this.settingService.addBranding(payload);
    return response;
  }

  @Get('get-settings/:setting')
  async getBranding(@Param() params: any) {
    return this.settingService.getBranding(params.setting);
  }

  @Get('get-data')
  async exportData(@Query() payload: any, @Res() res: any) {
    try {
      const response = await this.settingService.exportData(payload);
      const fileName = `${response.title}.xlsx`;
      res.attachment(fileName);
      return res.send(response.data);
    } catch (error) {
      throw error;
    }
  }

  private validatePaginationAndSorting(queries: any) {
    const { pageNumber, pageLength, sortKey, sortOrder } = queries;

    if (!pageNumber || !pageLength || !sortOrder || !sortKey) {
      throw new HttpException(
        'Sorting Order, Sorting Key, pageNumber, and pageLength are required.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!['id', 'name', 'description'].includes(sortKey)) {
      throw new HttpException(
        'Invalid sort key. Allowed values are "id", "name", and "description".',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!['asc', 'desc'].includes(sortOrder)) {
      throw new HttpException(
        'Invalid sorting order. Allowed values are "asc" and "desc".',
        HttpStatus.BAD_REQUEST,
      );
    }

    const parsedPageNumber = parseInt(pageNumber, 10);
    const parsedPageLength = parseInt(pageLength, 10);

    if (isNaN(parsedPageNumber) || isNaN(parsedPageLength)) {
      throw new HttpException(
        'pageNumber and pageLength must be valid numbers.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (parsedPageNumber <= 0 || parsedPageLength <= 0) {
      throw new HttpException(
        'pageNumber and pageLength must be positive values.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return { parsedPageNumber, parsedPageLength, sortKey, sortOrder };
  }

  // Nutrition APIs
  @Get('/nutritions')
  async getAllNutritions(@Query() queries: any) {
    const validatedQueries = this.validatePaginationAndSorting(queries);
    return this.nutritionService.getAllNutritions(validatedQueries);
  }

  @Get('/nutritions/:id')
  async getNutritionById(@Param('id') id: string) {
    return this.nutritionService.getNutritionById(Number(id));
  }

  @Post('/nutritions')
  @UsePipes(new ValidationPipe())
  async createNutrition(@Body() payload: createNutritionDTO) {
    return await this.nutritionService.addNewNutrition(payload);
  }

  @Put('/nutritions/:id')
  @UsePipes(new ValidationPipe())
  async updateNutrition(
    @Param('id') id: string,
    @Body() payload: updateNutritionDTO,
  ) {
    return await this.nutritionService.updateNutrition(payload, Number(id));
  }

  @Delete('/nutritions/:id')
  async deleteNutrition(@Param('id') id: string) {
    return await this.nutritionService.deleteNutrition(id);
  }

  // Workout APIs
  @Get('/workouts')
  async getAllWorkouts(@Query() queries: any) {
    const validatedQueries = this.validatePaginationAndSorting(queries);
    return await this.workoutService.getAllWorkouts(validatedQueries);
  }

  @Get('/workouts/:id')
  async getWorkoutById(@Param('id') id: string) {
    return await this.workoutService.getWorkoutById(Number(id));
  }

  @Post('/workouts')
  @UsePipes(new ValidationPipe())
  async createWorkout(@Body() payload: CreateWorkoutDTO) {
    return await this.workoutService.addNewWorkout(payload);
  }

  @Put('/workouts/:id')
  @UsePipes(new ValidationPipe())
  async updateWorkout(
    @Param('id') id: string,
    @Body() payload: UpdateWorkoutDTO,
  ) {
    return await this.workoutService.updateWorkout(Number(id), payload);
  }

  @Delete('/workouts/:id')
  async deleteWorkout(@Param('id') id: string) {
    return await this.workoutService.deleteWorkout(Number(id));
  }

  @Get('user/workouts/:userid')
  async getUserWorkouts(@Param() params: { userid: string }) {
    return await this.workoutService.getUserWorkouts(Number(params.userid));
  }

  @Get('user/nutritions/:userid')
  async getUserNutritions(@Param() params: { userid: string }) {
    return await this.nutritionService.getUserNutrition(Number(params.userid));
  }
}
