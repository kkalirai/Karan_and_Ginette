import * as AuthServices from '@/Layout/Auth/service';
import * as EditColumnServices from '@/Layout/Container/Components/EditColumns/service';
import * as AccountsServices from '@/Layout/Settings/Accounts/service';
import * as BrandingServices from '@/Layout/Settings/Branding/service';
import * as SettingService from '@/Layout/Settings/service';
import * as UserServices from '@/Layout/Settings/Users/service';
import * as NutritionServices from '@/Layout/Settings/Nutritions/service';
import * as ExercisesServices from '@/Layout/Settings/Workouts/service';
import * as ClientsServices from '@/Layout/Clients/service';
import * as InstructorsServices from '@/Layout/Instructors/service';
import * as ClientDetailsServices from '@/Layout/ClientDetails/service';
import * as InstructorDetailsServices from '@/Layout/InstructorDetails/service';
import * as CmsServices from '@/Layout/Settings/Cms/service';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ...AuthServices,
  ...UserServices,
  ...AccountsServices,
  ...BrandingServices,
  ...EditColumnServices,
  ...SettingService,
  ...NutritionServices,
  ...ExercisesServices,
  ...ClientsServices,
  ...InstructorsServices,
  ...ClientDetailsServices,
  ...InstructorDetailsServices,
  ...CmsServices,
};
