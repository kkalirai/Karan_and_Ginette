import { IsNotEmpty, IsString, IsEnum, IsInt, IsNumber } from 'class-validator';

export class createNutritionDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  planName: string;

  @IsNotEmpty()
  calories: number;

  @IsNotEmpty()
  protein: number;

  @IsNotEmpty()
  carbs: number;

  @IsNotEmpty()
  fats: number;

  @IsNotEmpty()
  @IsEnum(['Lunch', 'Dinner', 'Snack', 'Breakfast'])
  mealType: 'Lunch' | 'Dinner' | 'Snack' | 'Breakfast';

  @IsNotEmpty()
  @IsString()
  mealDescription: string;

  @IsNotEmpty()
  @IsString()
  goal: string;

  @IsNotEmpty()
  @IsEnum(['Vegan', 'Non-Vegan'])
  dietType: 'Vegan' | 'Non-Vegan';
}

// Updated updateNutritionDTO
export class updateNutritionDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  planName: string;

  @IsNotEmpty()
  @IsInt()
  calories: number;

  @IsNotEmpty()
  @IsNumber()
  protein: number;

  @IsNotEmpty()
  @IsNumber()
  carbs: number;

  @IsNotEmpty()
  @IsNumber()
  fats: number;

  @IsNotEmpty()
  @IsEnum(['Lunch', 'Dinner', 'Snack', 'Breakfast'])
  mealType: 'Lunch' | 'Dinner' | 'Snack' | 'Breakfast';

  @IsNotEmpty()
  @IsString()
  mealDescription: string;

  @IsNotEmpty()
  @IsString()
  goal: string;

  @IsNotEmpty()
  @IsEnum(['Vegan', 'Non-Vegan'])
  dietType: 'Vegan' | 'Non-Vegan';
}
