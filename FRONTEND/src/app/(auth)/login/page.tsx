// Components
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to Portal',
  keywords: 'Login ',
};
// Components
import Login from '@/Layout/Auth/Login';

async function Index() {
  return (
    <>
      <Login />
    </>
  );
}

export default Index;
