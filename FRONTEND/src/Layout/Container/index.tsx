'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { validateAuthentication } from '@/utils/helpers';

import { ContainerContextProvider } from './context';
// Import SidebarLayout
import SidebarLayout from './SidebarLayout';

const Footer = dynamic(() => import('./Components/Footer'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

type Props = {
  header?: boolean;
  children: JSX.Element | string | JSX.Element[];
  footer?: boolean;
  role?: string;
};

const Container: React.FC<Props> = ({ children, header }) => {
  const [hydrated, setHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const router = useRouter();

  // Do not render anything until hydration is complete
  if (!hydrated) return null;

  // Validate authentication before rendering layout
  if (!validateAuthentication()) {
    router.push('/login');
    return;
  }

  return (
    <SidebarLayout>
      {/* Render children inside SidebarLayout */}
      <div className="flex-1">
        <div className="viewPort">{children}</div>
        <Footer />
      </div>
    </SidebarLayout>
  );
};

const IndexContainer: React.FC<Props> = ({ children, header }) => {
  return (
    <ContainerContextProvider>
      <Container header={header}>{children}</Container>
    </ContainerContextProvider>
  );
};

export default IndexContainer;
