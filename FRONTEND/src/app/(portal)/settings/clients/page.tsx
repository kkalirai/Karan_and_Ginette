// Components
import { Metadata } from 'next';

import Clients from '@/Layout/Settings/Clients';

export const metadata: Metadata = {
  title: 'Settings - Clients',
  description: 'Settings Clients',
};

function Index() {
  return (
    <>
      <Clients />
    </>
  );
}

export default Index;
