export interface WorkoutTypeAttributes {
  id: number;
  name: string;
  description: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  instructions: string;
  primaryTargetMuscleGroup: string;
  secondaryTargetMuscleGroup: string;
  equipmentRequired: string;
  caloriesBurnedEstimate?: number;
  workoutType?: 'strength' | 'cardio' | 'flexibility' | 'balance';
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  muscle_group: string;
  goal: string;
  fitness_level?: 'beginner' | 'intermediate' | 'advanced';
}
