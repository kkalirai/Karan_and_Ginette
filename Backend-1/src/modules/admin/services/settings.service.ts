/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Role, UserRole } from 'src/modules/auth/entities/role.model';
import { User } from 'src/modules/auth/entities/user.model';
import { Sequelize } from 'sequelize';
import { setting } from '../entities/settings.model';
import { WorkoutTypes } from 'src/modules/admin/entities/workoutTypes.model';
import { Parser } from '@json2csv/plainjs';
import { NutritionTypes } from 'src/modules/admin/entities/nutritionTypes.model';

@Injectable()
export class SettingServices {
  constructor(
    @Inject('USERROLE_REPOSITORY') private userRoleRepo: typeof UserRole,
    @Inject('ROLE_REPOSITORY') private roleRepo: typeof Role,
    @Inject('WORKOUTTYPES_REPOSITORY')
    private workoutTypeRepo: typeof WorkoutTypes,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
    @Inject('NUTRITIONTYPES_REPOSITORY')
    private nutritionTypeRepo: typeof NutritionTypes,
    @Inject('SETTINGS_PROVIDER') private settingRepo: typeof setting,
    @Inject('USER_REPOSITORY') private userRepo: typeof User,
  ) {}

  public async count(id) {
    try {
      const userRole = await this.userRoleRepo.findOne({
        where: {
          userID: id,
        },
      });
      const role = (await this.roleRepo.findByPk(userRole.roleID)).role;
      if (role === 'instructor') {
        return {
          status: HttpStatus.OK,
          message: 'Success',
          data: {},
        };
      } else if (role === 'superadmin' || role === 'admin') {
        const userCount = await this.userRoleRepo.count({
          where: { roleID: 3 },
        });
        const instructorCount = await this.userRoleRepo.count({
          where: { roleID: 4 },
        });

        return {
          status: HttpStatus.OK,
          message: 'Success',
          data: {
            Clients: userCount,
            Instructors: instructorCount,
          },
        };
      }
    } catch (error) {
      throw error;
    }
  }

  public async addBranding(payload) {
    try {
      const moduleName = payload.moduleName;
      delete payload.moduleName;
      let data = JSON.stringify({
        payload,
      });

      let newSetting = await this.settingRepo.findOne({
        where: {
          moduleName: moduleName,
        },
      });

      if (!newSetting) {
        newSetting = await this.settingRepo.create({
          moduleName: moduleName,
          data: JSON.stringify({
            ...payload,
          }),
        });
        return {
          status: true,
          data: newSetting,
          code: HttpStatus.OK,
          message: 'New setting created',
        };
      } else {
        data = JSON.parse(newSetting?.data);

        Object.keys(payload).forEach((key) => {
          if (payload[key] !== undefined) {
            data[key] = payload[key];
          }
        });
        newSetting.data = JSON.stringify(data);
        await newSetting.save();
        return {
          status: true,
          data: newSetting,
          code: HttpStatus.OK,
          message: 'setting Updated',
        };
      }
      // const data = JSON.stringify({
      //     font: payload?.font || null,
      //     primaryColor: payload?.primaryColor || null,
      //     banner: payload?.banner || null,
      //     logo: payload?.logo || null,
      // })
      // // console.log("🚀 ~ SettingServices ~ addBranding ~ data:", data)

      // newSetting.data = data;
      // newSetting.moduleName = payload.moduleName
      // await newSetting.save()
      // return {
      //     newSetting
      // }
    } catch (error) {
      throw error;
    }
  }

  public async getBranding(moduleName) {
    try {
      const settings = await this.settingRepo.findOne({
        where: {
          moduleName: moduleName,
        },
        raw: true,
      });

      if (!settings) {
        throw new HttpException('Setting Not Found', HttpStatus.BAD_REQUEST);
      }
      // console.log("🚀 ~ SettingServices ~ getBranding ~ settings:", settings)

      const formatedSettings = JSON.parse(settings.data);
      // console.log("🚀 ~ SettingServices ~ getBranding ~ formatedSettings:", formatedSettings)
      // console.log("🚀 ~ SettingServices ~ getBranding ~ formatedSettings:", formatedSettings.font)

      const banner = formatedSettings?.banner?.replace('public', '');
      const logo = formatedSettings?.logo?.replace('public', '');

      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Success',
        columnData: {
          font: formatedSettings.font,
          primaryColor: formatedSettings.primaryColor,
          banner: banner,
          logo: logo,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  public async exportData(payload) {
    try {
      let data,
        title,
        columnNames = [],
        i;
      switch (payload.moduleName) {
        case 'clients':
          data = await this.userRepo.findAll({
            include: [
              {
                model: UserRole,
                include: [Role],
                attributes: [],
              },
            ],
            where: {
              '$userroles.role.role$': 'user', // Use correct syntax for nested associations
            },
            attributes: [
              'firstName',
              'lastName',
              'email',
              'height',
              'weight',
              'contact',
            ],
            raw: true,
          });
          data.map((item) => {
            delete item['userroles.role.id'];
            delete item['userroles.role.role'];
            delete item['userroles.role.createdAt'];
            delete item['userroles.role.updatedAt'];
          });
          console.log('🚀 ~ SettingServices ~ exportData ~ data:', data);
          (columnNames = [
            'firstName',
            'lastName',
            'email',
            'height',
            'weight',
            'contact',
          ]),
            // console.log("🚀 ~ SettingServices ~ exportData ~ data:", data)

            (title = 'Clients');
          break;

        case 'instructors':
          data = await this.userRepo.findAll({
            include: [
              {
                model: UserRole,
                include: [Role],
                attributes: [],
              },
            ],
            where: {
              '$userroles.role.role$': 'instructor', // Use correct syntax for nested associations
            },
            attributes: [
              'firstName',
              'lastName',
              'email',
              'height',
              'weight',
              'contact',
            ],
            raw: true,
          });
          data.map((item) => {
            delete item['userroles.role.id'];
            delete item['userroles.role.role'];
            delete item['userroles.role.createdAt'];
            delete item['userroles.role.updatedAt'];
          });
          console.log('🚀 ~ SettingServices ~ exportData ~ data:', data);
          columnNames = [
            'firstName',
            'lastName',
            'email',
            'height',
            'weight',
            'contact',
          ];

          title = 'Instructors';
          break;

        case 'users':
          data = await this.userRepo.findAll({
            include: [
              {
                model: UserRole,
                include: [Role],
                attributes: [],
                required: true,
              },
            ],
            where: {
              '$userroles.role.role$': ['admin', 'superadmin'],
            },
            attributes: ['firstName', 'lastName', 'email', 'gender'],
            raw: true,
          });
          data.map((item) => {
            delete item['userroles.role.id'];
            delete item['userroles.role.role'];
            delete item['userroles.role.createdAt'];
            delete item['userroles.role.updatedAt'];
          });
          console.log('🚀 ~ SettingServices ~ exportData ~ data:', data);
          title = 'Users';
          columnNames = ['firstName', 'lastName', 'email', 'gender'];
          break;

        case 'nutrition-types':
          data = await this.nutritionTypeRepo.findAll({
            attributes: ['id', 'name', 'description'],
            raw: true,
          });
          columnNames = ['name', 'description'];
          title = 'Nutrition Types';
          i = 1;

          data.map((item) => {
            item['id'] = i;
            i++;
          });
          break;

        case 'workout-types':
          data = await this.workoutTypeRepo.findAll({
            attributes: ['id', 'name', 'description'],
            raw: true,
          });
          title = 'Workout Types';
          columnNames = ['id', 'name', 'description'];
          i = 1;

          data.map((item) => {
            item['id'] = i;
            i++;
          });
          break;

        case 'instructor-client':
          console.log(
            '🚀 ~ SettingServices ~ exportData ~ instructorId:',
            payload.instructorId,
          );
          if (!payload.instructorId) {
            throw new HttpException(
              'Validation Failed - No instructor ID',
              HttpStatus.BAD_REQUEST,
            );
          }

          data = await this.userRepo.findAll({
            include: [
              {
                model: UserRole,
                include: [Role],
                attributes: [],
              },
            ],
            where: {
              '$userroles.role.role$': 'user',
              instructorId: payload.instructorId,
            } as any,
            attributes: [
              'firstName',
              'lastName',
              'email',
              'height',
              'weight',
              'contact',
            ],
            raw: true,
          });
          columnNames = [
            'firstName',
            'lastName',
            'email',
            'height',
            'weight',
            'contact',
          ];

          // console.log("🚀 ~ SettingServices ~ exportData ~ data:", data)

          break;

        default:
          data = [];
      }

      const dataToParse =
        data.length > 0
          ? data
          : [Object.fromEntries(columnNames.map((col) => [col, '']))];

      const parser = new Parser();

      const csv = parser.parse(dataToParse);
      return { data: csv, title: title };
    } catch (error) {
      throw error;
    }
  }
}
