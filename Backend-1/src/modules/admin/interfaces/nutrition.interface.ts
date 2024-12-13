export interface NutritionTypeAttributes {
  id: number;
  name: string;
  instructorId: number;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType: 'Lunch' | 'Dinner' | 'Snack' | 'Breakfast';
  planName: string;
  mealDescription: string;
  goal: string;
  dietType: 'Vegan' | 'Non-Vegan';
}
