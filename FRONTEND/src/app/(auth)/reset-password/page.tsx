// Components
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

import { SuspenseLoader } from '@/components/App/Loader';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset Password to Portal',
  keywords: 'Reset Password',
};
// Components
const ResetPassword = dynamic(() => import('@/Layout/Auth/ResetPassword'), {
  loading: () => <SuspenseLoader />,
  ssr: false,
});

async function Index() {
  return (
    <>
      <ResetPassword />
    </>
  );
}

export default Index;
