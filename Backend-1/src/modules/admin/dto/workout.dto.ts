import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateWorkoutDTO {
  @ApiProperty({ description: 'Name of the workout' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Duration of the workout in minutes' })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({
    description: 'Intensity level of the workout',
    enum: ['low', 'medium', 'high'],
  })
  @IsNotEmpty()
  @IsEnum(['low', 'medium', 'high'])
  intensity: 'low' | 'medium' | 'high';

  @ApiProperty({ description: 'Step-by-step workout instructions' })
  @IsNotEmpty()
  @IsString()
  instructions: string;

  @ApiProperty({ description: 'Target muscle group for the workout' })
  @IsNotEmpty()
  @IsString()
  muscle_group: string;

  @ApiProperty({
    description: 'Required equipment as a comma-separated string',
  })
  @IsNotEmpty()
  @IsString()
  equipmentRequired: string;

  @ApiProperty({
    description: 'Workout category (optional)',
    enum: ['strength', 'cardio', 'flexibility', 'balance'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['strength', 'cardio', 'flexibility', 'balance'])
  workoutType?: 'strength' | 'cardio' | 'flexibility' | 'balance';

  @ApiProperty({
    description: 'Skill level required for the workout (optional)',
    enum: ['beginner', 'intermediate', 'advanced'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced'])
  fitness_level?: 'beginner' | 'intermediate' | 'advanced';

  @ApiProperty({
    description: 'Goal of the workout (optional)',
    enum: [
      'Lose weight',
      'Build muscle',
      'Improve endurance',
      'Increase flexibility',
      'General fitness',
    ],
    required: false,
  })
  @IsOptional()
  @IsEnum([
    'Lose weight',
    'Build muscle',
    'Improve endurance',
    'Increase flexibility',
    'General fitness',
  ])
  goal?:
    | 'Lose weight'
    | 'Build muscle'
    | 'Improve endurance'
    | 'Increase flexibility'
    | 'General fitness';
}

export class UpdateWorkoutDTO {
  @ApiProperty({
    description: 'Name of the workout',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Duration of the workout in minutes',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @ApiProperty({
    description: 'Intensity level of the workout',
    enum: ['low', 'medium', 'high'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  intensity?: 'low' | 'medium' | 'high';

  @ApiProperty({
    description: 'Step-by-step workout instructions',
    required: false,
  })
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiProperty({
    description: 'Target muscle group for the workout',
    required: false,
  })
  @IsOptional()
  @IsString()
  muscle_group?: string;

  @ApiProperty({
    description: 'Required equipment as a comma-separated string',
    required: false,
  })
  @IsOptional()
  @IsString()
  equipmentRequired?: string;

  @ApiProperty({
    description: 'Workout category (optional)',
    enum: ['strength', 'cardio', 'flexibility', 'balance'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['strength', 'cardio', 'flexibility', 'balance'])
  workoutType?: 'strength' | 'cardio' | 'flexibility' | 'balance';

  @ApiProperty({
    description: 'Skill level required for the workout (optional)',
    enum: ['beginner', 'intermediate', 'advanced'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced'])
  fitness_level?: 'beginner' | 'intermediate' | 'advanced';

  @ApiProperty({
    description: 'Goal of the workout (optional)',
    enum: [
      'Lose weight',
      'Build muscle',
      'Improve endurance',
      'Increase flexibility',
      'General fitness',
    ],
    required: false,
  })
  @IsOptional()
  @IsEnum([
    'Lose weight',
    'Build muscle',
    'Improve endurance',
    'Increase flexibility',
    'General fitness',
  ])
  goal?:
    | 'Lose weight'
    | 'Build muscle'
    | 'Improve endurance'
    | 'Increase flexibility'
    | 'General fitness';
}
