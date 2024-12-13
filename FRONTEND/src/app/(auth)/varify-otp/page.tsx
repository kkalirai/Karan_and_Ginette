// Components
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

import { SuspenseLoader } from '@/components/App/Loader';

export const metadata: Metadata = {
  title: 'Varify OTP',
  description: 'Varify OTP to Portal',
  keywords: 'Varify OTP',
};
// Components
const VarifyOtp = dynamic(() => import('@/Layout/Auth/VarifyOtp'), {
  loading: () => <SuspenseLoader />,
  ssr: false,
});

async function Index() {
  return (
    <>
      <VarifyOtp />
    </>
  );
}

export default Index;
