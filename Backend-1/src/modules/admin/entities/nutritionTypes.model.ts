import { Optional } from 'sequelize';

import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { NutritionTypeAttributes } from '../interfaces/nutrition.interface';

interface NutritionTypeCreationAttributes
  extends Optional<NutritionTypeAttributes, 'id'> {}

@Table
export class NutritionTypes extends Model<
  NutritionTypeCreationAttributes,
  NutritionTypeAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: true,
  })
  id: number;

  @Column({
    allowNull: false,
  })
  name: string;

  @Column({
    allowNull: false,
  })
  description: string;

  @Column({ allowNull: false })
  planName: string;

  @Column({ allowNull: false, type: DataType.INTEGER })
  calories: number;

  @Column({ allowNull: false, type: DataType.FLOAT })
  protein: number;

  @Column({ allowNull: false, type: DataType.FLOAT })
  carbs: number;

  @Column({ allowNull: false, type: DataType.FLOAT })
  fats: number;

  @Column({
    allowNull: false,
    type: DataType.ENUM('Lunch', 'Dinner', 'Snack', 'Breakfast'),
  })
  mealType: 'Lunch' | 'Dinner' | 'Snack' | 'Breakfast';

  @Column({ allowNull: false, type: DataType.STRING })
  mealDescription: string;

  @Column({ allowNull: false, type: DataType.STRING })
  goal: string;

  @Column({
    allowNull: false,
    type: DataType.ENUM('Non-Vegan', 'Vegan'),
  })
  dietType: 'Vegan' | 'Non-Vegan';
}
