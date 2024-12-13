/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { QueryTypes, Sequelize } from 'sequelize';
import { Parser } from '@json2csv/plainjs';
import { Op } from 'sequelize';
import { NutritionTypes } from 'src/modules/admin/entities/nutritionTypes.model';
import { User } from 'src/modules/auth/entities/user.model';

@Injectable()
export class NutritionService {
  constructor(
    @Inject('NUTRITIONTYPES_REPOSITORY')
    private nutritionTypeRepo: typeof NutritionTypes,

    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,

    @Inject('USER_REPOSITORY') private userRepo: typeof User,
  ) {}

  // Helper method to validate pagination and sorting parameters
  private validatePaginationAndSorting(queries: any) {
    const pageNumber = Math.max(1, Math.floor(+queries.pageNumber || 1));
    const pageLength = Math.max(1, Math.floor(+queries.pageLength || 10));

    if (!['id', 'name', 'description'].includes(queries.sortKey)) {
      throw new HttpException(
        'Invalid sort key. Allowed values are "id", "name", and "description".',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!['asc', 'desc'].includes(queries.sortOrder?.toLowerCase())) {
      throw new HttpException(
        'Invalid sorting order. Allowed values are "asc" and "desc".',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      pageNumber,
      pageLength,
      sortKey: queries.sortKey,
      sortOrder: queries.sortOrder.toUpperCase(),
    };
  }

  // Fetch all nutritions with pagination, sorting, and optional search
  public async getAllNutritions(queries: any) {
    const { parsedPageNumber, parsedPageLength, sortKey, sortOrder } = queries;
    const offset = (parsedPageNumber - 1) * parsedPageLength;

    console.log(queries);

    try {
      let nutritions: any[], total: number;

      if (queries.searchKey) {
        const keyword = `%${queries.searchKey}%`;
        const replacements = { keyword, limit: parsedPageLength, offset };

        total = await this.nutritionTypeRepo.count({
          where: Sequelize.or(
            { name: { [Op.like]: keyword } },
            { description: { [Op.like]: keyword } },
          ),
        });

        nutritions = await this.sequelize.query(
          `SELECT * FROM NutritionTypes 
           WHERE name LIKE :keyword OR description LIKE :keyword
           ORDER BY id DESC
           LIMIT :limit OFFSET :offset`,
          { type: QueryTypes.SELECT, replacements },
        );
      } else {
        total = await this.nutritionTypeRepo.count();
        nutritions = await this.sequelize.query(
          `SELECT * FROM NutritionTypes 
           ORDER BY id DESC
           LIMIT :limit OFFSET :offset`,
          {
            type: QueryTypes.SELECT,
            replacements: { limit: parsedPageLength, offset },
          },
        );
      }

      return {
        status: HttpStatus.OK,
        message: 'Fetched Nutritions Successfully',
        data: { result: nutritions, total },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Fetch a single nutrition by ID
  public async getNutritionById(id: number) {
    try {
      const nutrition = await this.nutritionTypeRepo.findByPk(id);

      if (!nutrition) {
        throw new HttpException('Nutrition not found', HttpStatus.NOT_FOUND);
      }

      return {
        status: HttpStatus.OK,
        message: 'Nutrition fetched successfully',
        data: { nutrition },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Create a new nutrition
  public async addNewNutrition(data: {
    name: string;
    description: string;
    planName: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
    mealDescription: string;
    goal: string;
    dietType: 'Vegan' | 'Non-Vegan';
  }) {
    try {
      // Check if the nutrition plan already exists by name
      const exists = await this.nutritionTypeRepo.findOne({
        where: { name: data.name },
      });

      if (exists) {
        throw new HttpException(
          'Nutrition already exists',
          HttpStatus.CONFLICT,
        );
      }

      // Create the new nutrition plan
      const newNutrition = await this.nutritionTypeRepo.create({
        ...data,
        instructorId: 1, // Assigning a default instructorId; update as necessary
      });

      return {
        status: HttpStatus.CREATED,
        message: 'Created new Nutrition',
        data: { nutrition: newNutrition },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Update a nutrition by ID
  public async updateNutrition(
    data: {
      name: string;
      description: string;
      planName: string;
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
      mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
      mealDescription: string;
      goal: string;
      dietType: 'Vegan' | 'Non-Vegan';
    },
    id: number,
  ) {
    try {
      const nutrition = await this.nutritionTypeRepo.findByPk(id);

      if (!nutrition) {
        throw new HttpException('Nutrition not found', HttpStatus.NOT_FOUND);
      }

      await nutrition.update(data);

      return {
        status: HttpStatus.OK,
        message: 'Updated Nutrition successfully',
        data: { nutrition },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // Delete a nutrition by ID
  public async deleteNutrition(id) {
    try {
      const nutrition = await this.nutritionTypeRepo.findByPk(id);

      if (!nutrition) {
        throw new HttpException('Nutrition not found', HttpStatus.NOT_FOUND);
      }
      await nutrition.destroy();

      return {
        status: HttpStatus.OK,
        message: 'Deleted Nutrition successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Export nutritions to CSV
  public async getCSVData() {
    try {
      const data = await this.nutritionTypeRepo.findAll({
        attributes: ['name', 'description'],
        raw: true,
      });

      const parser = new Parser();
      return parser.parse(data);
    } catch (error) {
      throw new HttpException(
        'Failed to generate CSV',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getUserNutrition(id: number) {
    const user = await this.userRepo.findByPk(id);
    if (!user) {
      throw new HttpException('Invalid Userid', HttpStatus.BAD_REQUEST);
    }

    const data = await this.nutritionTypeRepo.findAll({
      limit: 10,
      where: {
        dietType: user.dietType,
        goal: user.nutritionGoal,
      },
    });

    return {
      status: true,
      code: HttpStatus.OK,
      data: data,
    };
  }
}
