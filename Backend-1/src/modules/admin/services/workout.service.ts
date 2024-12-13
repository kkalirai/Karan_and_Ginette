import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { WorkoutTypes } from 'src/modules/admin/entities/workoutTypes.model';
import { User } from 'src/modules/auth/entities/user.model';

@Injectable()
export class WorkoutService {
  constructor(
    @Inject('WORKOUTTYPES_REPOSITORY')
    private workoutTypeRepo: typeof WorkoutTypes,
    @Inject('USER_REPOSITORY') private userRepo: typeof User,
  ) {}

  // Helper for throwing exceptions
  private throwException(message: string, status: HttpStatus): never {
    throw new HttpException(message, status);
  }

  public async getAllWorkouts(queries: any) {
    try {
      console.log(queries);

      const pageNumber = Math.max(1, Math.floor(queries.parsedPageNumber || 1));
      const pageLength = Math.max(
        1,
        Math.floor(queries.parsedPageLength || 10),
      );
      const offset = (pageNumber - 1) * pageLength;

      const whereCondition = queries.searchKey
        ? {
            [Op.or]: [
              { name: { [Op.like]: `%${queries.searchKey}%` } },
              { description: { [Op.like]: `%${queries.searchKey}%` } },
            ],
          }
        : {};

      const workoutsLength = await this.workoutTypeRepo.count({
        where: whereCondition,
      });
      const maxPageNumber = Math.ceil(workoutsLength / pageLength);
      if (pageNumber > maxPageNumber)
        this.throwException('Invalid Page Number.', HttpStatus.BAD_REQUEST);

      const workouts = await this.workoutTypeRepo.findAll({
        where: whereCondition,
        limit: pageLength,
        offset,
        order: [['id', 'DESC']],
      });

      return {
        status: HttpStatus.OK,
        message: 'Data fetched successfully',
        data: {
          result: workouts,
          total: workoutsLength,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  public async getWorkoutById(id: number) {
    const workout = await this.workoutTypeRepo.findByPk(id);
    if (!workout)
      this.throwException('Workout not found.', HttpStatus.BAD_REQUEST);

    return {
      status: HttpStatus.OK,
      message: 'Workout fetched successfully',
      data: { Workout: workout },
    };
  }

  public async addNewWorkout(data: { [Key: string]: any }) {
    const exists = await this.workoutTypeRepo.findOne({
      where: { name: data.name },
    });

    if (exists)
      this.throwException('Workout already exists.', HttpStatus.BAD_REQUEST);

    const newWorkout = await this.workoutTypeRepo.create({
      name: data.name,
      instructions: data.instructions,
      intensity: data.intensity,
      duration: data.duration,
      muscle_group: data.muscle_group,
      equipmentRequired: data.equipmentRequired ?? 'body',
      workoutType: data.workoutType,
      fitness_level: data?.fitness_level,
      goal: data?.goal,
    });

    return {
      status: HttpStatus.CREATED,
      message: 'Workout created successfully',
      data: { Workout: newWorkout },
    };
  }

  public async updateWorkout(id: number, data: { [key: string]: any }) {
    const workout = await this.workoutTypeRepo.findByPk(id);
    if (!workout)
      this.throwException('Workout not found.', HttpStatus.BAD_REQUEST);

    workout.name = data.name;
    workout.instructions = data.instructions;
    workout.goal = data.goal;
    workout.intensity = data.intensity;
    workout.duration = data.duration;
    workout.muscle_group = data.muscle_group;
    workout.equipmentRequired = data.equipmentRequired;
    workout.fitness_level = data.fitness_level;
    workout.workoutType = data.workoutType;
    await workout.save();

    return {
      status: HttpStatus.OK,
      message: 'Workout updated successfully',
      data: { Workout: workout },
    };
  }

  public async deleteWorkout(id: number) {
    const workout = await this.workoutTypeRepo.findByPk(id);
    if (!workout)
      this.throwException('Workout not found.', HttpStatus.BAD_REQUEST);

    await this.workoutTypeRepo.destroy({
      where: {
        id: id,
      },
    });
    try {
    } catch (error) {
      throw error;
    }

    return {
      status: HttpStatus.OK,
      message: 'Workout deleted successfully',
    };
  }

  public async getUserWorkouts(id: number) {
    try {
      const user = await this.userRepo.findByPk(id);
      if (!user) {
        throw new HttpException('Invalid Userid', HttpStatus.BAD_REQUEST);
      }

      const data = await this.workoutTypeRepo.findAll({
        limit: 10,
        where: {
          intensity: user.preferredIntensity,
          goal: user.fitnessGoal,
        },
      });

      return {
        status: true,
        code: HttpStatus.OK,
        data: data,
      };
    } catch (error) {
      throw error;
    }
  }
}
