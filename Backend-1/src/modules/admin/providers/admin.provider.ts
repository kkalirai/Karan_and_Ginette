import { NutritionTypes } from '../entities/nutritionTypes.model';
import { setting } from '../entities/settings.model';
import { WorkoutTypes } from '../entities/workoutTypes.model';

export const SettingsProvider = [
  {
    provide: 'SETTINGS_PROVIDER',
    useValue: setting,
  },
];

export const nutritionTypeProvider = [
  {
    provide: 'NUTRITIONTYPES_REPOSITORY',
    useValue: NutritionTypes,
  },
];

export const WorkoutTypeProvider = [
  {
    provide: 'WORKOUTTYPES_REPOSITORY',
    useValue: WorkoutTypes,
  },
];
