/* eslint-disable prettier/prettier */
import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  AllowNull,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Userattributes } from '../interfaces/user.interface';
import { UserRole } from './role.model';

interface UserCreationAttributes extends Optional<Userattributes, 'id'> {}

@Table
export class User extends Model<Userattributes, UserCreationAttributes> {
  [x: string]: any;
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: true,
  })
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @AllowNull(true)
  @Column
  firstName: string;

  @AllowNull(true)
  @Column
  lastName: string;

  @Column
  height: number;

  @Column
  weight: number;

  @Column({
    unique: true,
    allowNull: true, // Change allowNull property to true
  })
  contact: string;

  @Column({
    unique: true,
  })
  socialId: string;

  @Default(false)
  @Column
  isVerified: boolean;

  @Column
  socialProvider: string;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  isActive: boolean;

  @AllowNull(true)
  @Column
  password: string;

  @Column
  gender: string;

  @Column
  otp: string;

  @Column
  otpSendTime: Date;

  @Default(0)
  @Column
  noOfAttempts: number;

  @Column
  location: string;

  @Column
  about: string;

  @Column
  profile: string;

  @Column
  lastLogin: Date;

  @HasMany(() => UserRole)
  userroles: UserRole[];

  @Column({
    type: DataType.ENUM(
      'Lose weight',
      'Build muscle',
      'Improve endurance',
      'Increase flexibility',
      'General fitness',
    ),
    allowNull: true,
    comment: "User's fitness goal for workout recommendations",
  })
  fitnessGoal:
    | 'Lose weight'
    | 'Build muscle'
    | 'Improve endurance'
    | 'Increase flexibility'
    | 'General fitness';

  @Column({
    type: DataType.ENUM('low', 'medium', 'high'),
    allowNull: true,
    comment: 'Preferred workout intensity',
  })
  preferredIntensity: 'low' | 'medium' | 'high';

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: "User's preferred workout duration in minutes",
  })
  preferredWorkoutDuration: number;

  @Column({
    type: DataType.ENUM('Vegan', 'Non-Vegan'),
    allowNull: true,
    comment: "User's diet type for nutrition recommendations",
  })
  dietType: 'Vegan' | 'Non-Vegan';

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: "User's nutrition goal for meal planning",
  })
  nutritionGoal: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: "User's nutrition goal for meal planning",
  })
  workoutGoal: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: "User's ideal calorie range for meal recommendations",
  })
  calorieRange: string;
}
