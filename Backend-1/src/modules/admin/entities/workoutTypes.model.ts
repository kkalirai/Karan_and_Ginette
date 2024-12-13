import { Optional } from 'sequelize';
import { WorkoutTypeAttributes } from '../interfaces/workout.interface';
import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

interface WorkoutTypeCreationAttributes
  extends Optional<WorkoutTypeAttributes, 'id'> {}

@Table
export class WorkoutTypes extends Model<
  WorkoutTypeAttributes,
  WorkoutTypeCreationAttributes
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
    type: DataType.INTEGER,
    allowNull: false,
    comment: 'Duration of the workout in minutes',
  })
  duration: number;

  @Column({
    type: DataType.ENUM('low', 'medium', 'high'),
    allowNull: false,
    comment: 'Intensity level of the workout',
  })
  intensity: 'low' | 'medium' | 'high';

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'Step-by-step workout instructions',
  })
  instructions: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: 'Target muscle group for the workout',
  })
  muscle_group: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'Required equipment as a comma-separated string',
  })
  equipmentRequired: string;

  @Column({
    type: DataType.ENUM('strength', 'cardio', 'flexibility', 'balance'),
    allowNull: true,
    comment: 'Workout category (optional)',
  })
  workoutType?: 'strength' | 'cardio' | 'flexibility' | 'balance';

  @Column({
    type: DataType.ENUM('beginner', 'intermediate', 'advanced'),
    allowNull: true,
    comment: 'Skill level required for the workout (optional)',
  })
  fitness_level?: 'beginner' | 'intermediate' | 'advanced';

  @Column({
    type: DataType.ENUM(
      'Lose weight',
      'Build muscle',
      'Improve endurance',
      'Increase flexibility',
      'General fitness',
    ),
    allowNull: true,
    comment: 'Goal of the workout (optional)',
  })
  goal?:
    | 'Lose weight'
    | 'Build muscle'
    | 'Improve endurance'
    | 'Increase flexibility'
    | 'General fitness';
}
