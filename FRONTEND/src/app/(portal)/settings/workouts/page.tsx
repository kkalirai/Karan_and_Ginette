// Components
import { Metadata } from 'next';

import Workouts from '@/Layout/Settings/Workouts';

export const metadata: Metadata = {
  title: 'Settings - Static Pages',
  description: 'Settings Static Pages',
};

function Index() {
  return (
    <>
      <Workouts />
    </>
  );
}

export default Index;
