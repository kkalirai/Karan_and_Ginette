// Components
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import { SuspenseLoader } from '@/components/App/Loader';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Settings',
};
// Components

const Settings = dynamic(() => import('@/Layout/Settings'), {
  loading: () => <SuspenseLoader />,
  ssr: false,
});

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <Settings>{children}</Settings>;
};

export default Layout;
