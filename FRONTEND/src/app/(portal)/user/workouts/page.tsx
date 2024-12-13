// Components
import { Metadata } from 'next';

import Workouts from '@/Layout/User/Workouts';

export const metadata: Metadata = {
  title: 'Settings - Accounts',
  description: 'Settings',
};

async function Index() {

  return (
    <>
      <Workouts />
    </>
  );
}

export default Index;
