// Components
import { Metadata } from 'next';

import Nutritions from '@/Layout/Settings/Nutritions';

export const metadata: Metadata = {
  title: 'Settings - Static Pages',
  description: 'Settings Static Pages',
};

function Index() {
  return (
    <>
      <Nutritions />
    </>
  );
}

export default Index;
