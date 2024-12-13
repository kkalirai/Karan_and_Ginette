// Components
import { Metadata } from 'next';

import Users from '@/Layout/Settings/Users';

export const metadata: Metadata = {
  title: 'Settings - Users',
  description: 'Settings Users',
};

function Index() {
  return (
    <>
      <Users />
    </>
  );
}

export default Index;
