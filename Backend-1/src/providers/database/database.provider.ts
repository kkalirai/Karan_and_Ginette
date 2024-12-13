import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/modules/auth/entities/user.model';
import { Role, UserRole } from 'src/modules/auth/entities/role.model';
import { WorkoutTypes } from 'src/modules/admin/entities/workoutTypes.model';
import { setting } from 'src/modules/admin/entities/settings.model';
import { Dialect } from 'sequelize';
import { NutritionTypes } from 'src/modules/admin/entities/nutritionTypes.model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        port: 3306,
        dialect: process.env.DATABASE_DILECT as Dialect,
        host: process.env.DATABASE_HOST,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
      });
      sequelize.addModels([
        User,
        UserRole,
        Role,
        WorkoutTypes,
        NutritionTypes,
        setting,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
