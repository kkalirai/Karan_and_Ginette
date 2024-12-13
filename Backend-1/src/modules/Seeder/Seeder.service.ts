import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { WorkoutTypes } from '../admin/entities/workoutTypes.model';
import { NutritionTypes } from '../admin/entities/nutritionTypes.model';
import { Role, UserRole } from '../auth/entities/role.model';
import { RoleENUM } from 'src/common/enum/userRole.enum';
import { User } from '../auth/entities/user.model';
import { PasswordService } from '../auth/services/password.services';
import { setting } from '../admin/entities/settings.model';

@Injectable()
export class SeederService {
  constructor(
    @Inject('SETTINGS_PROVIDER') private settingRepo: typeof setting,
    @Inject('WORKOUTTYPES_REPOSITORY')
    private workoutTypeRepo: typeof WorkoutTypes,
    @Inject('NUTRITIONTYPES_REPOSITORY')
    private nutritionTypeRepo: typeof NutritionTypes,
    @Inject('ROLE_REPOSITORY') private roleRepo: typeof Role,
    @Inject('USER_REPOSITORY') private userRepo: typeof User,
    @Inject('USERROLE_REPOSITORY') private userRoleRepo: typeof UserRole,
    private readonly passwordService: PasswordService,
  ) {}

  async run() {
    try {
      // Getting data from file

      // Seeding Workouts
      const alreadyPresentWorkout = await this.workoutTypeRepo.count();
      if (alreadyPresentWorkout === 0) {
        const file = fs.readFileSync('./output.json', 'utf8');
        const data = JSON.parse(file);
        let i = 0;
        const total = data.length;
        for (const item of data) {
          await this.workoutTypeRepo.create({
            name: item.name,
            instructions: item.instructions,
            intensity: item.intensity,
            duration: item.duration,
            muscle_group: item.muscle_group,
            equipmentRequired: item.equipmentRequired ?? 'body',
            workoutType: item.workoutType,
            fitness_level: item?.fitness_level,
            goal: item?.goal,
          });

          console.log(`Added ${i} out of ${total}`);
          i++;
        }
      }

      // Seeding Nutrition
      const alreadyPresent = await this.nutritionTypeRepo.count();

      if (alreadyPresent === 0) {
        const nutritionData = JSON.parse(
          fs.readFileSync('./nutrition.json', 'utf8'),
        );
        let i = 0;
        const totalNutrition = nutritionData.length;
        for (const item of nutritionData) {
          await this.nutritionTypeRepo.create({
            name: item.name,
            description: item.description,
            planName: item.planName,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fats: item.fats,
            mealType: item.mealType,
            mealDescription: item.mealDescription,
            goal: item.goal,
            dietType: item.dietType,
          });

          console.log(`Added ${i} out of ${totalNutrition}`);
          i++;
        }
      }

      // Seeding Role
      const roleEmpty = await this.roleRepo.count();
      if (roleEmpty === 0) {
        const roles = [
          RoleENUM.superadmin,
          RoleENUM.admin,
          RoleENUM.instructor,
          RoleENUM.user,
        ];
        for (const i of roles) {
          await this.roleRepo.create({
            role: i,
          });
        }
      }

      // Seed Super Admin
      const userExists = await this.userRepo.count();

      if (userExists === 0) {
        const hashedPassword =
          await this.passwordService.encryptPassword('Test@123');
        const user = await this.userRepo.create({
          email: 'admin@yopmail.com',
          password: hashedPassword,
          firstName: 'Nikhil',
          lastName: 'Bansal',
          isVerified: true,
        });

        await this.userRoleRepo.create({
          userID: user?.id,
          roleID: 1,
        });
      }

      await this.settingRepo.create({
        moduleName: 'branding',
        data: JSON.stringify({
          font: 'Poppins',
          primaryColor: '#000000',
          banner: '/img/uploads/banner-1720678376552-334729442.jpg',
          logo: '/img/uploads/logo-1720678376552-810009742.png',
        }),
      });
    } catch (error) {
      throw error;
    }
  }
}
