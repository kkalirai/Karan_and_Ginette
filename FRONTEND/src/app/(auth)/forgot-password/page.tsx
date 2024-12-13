// Components
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

import { SuspenseLoader } from '@/components/App/Loader';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Forgot Password to Portal',
  keywords: 'Forgot Password',
};
// Components
const ForgotPassword = dynamic(() => import('@/Layout/Auth/ForgotPassword'), {
  loading: () => <SuspenseLoader />,
  ssr: false,
});

async function Index() {
  return (
    <>
      <ForgotPassword />
    </>
  );
}

export default Index;
