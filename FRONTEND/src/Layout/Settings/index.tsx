'use client';
import dynamic from 'next/dynamic';
import React, { memo } from 'react';

import LeftPanel from './Components/LeftPanel';

const Footer = dynamic(() => import('@/Layout/Container/Components/Footer'), {
  loading: () => <div></div>,
  ssr: false,
});
type PROPS = {
  children: React.ReactNode;
};

function Index(props: PROPS) {
  return (
    <div className="pannel">
      <div className="rightPannel">
        <div className="CustomTab">{props?.children}</div>
        <Footer />
      </div>
    </div>
  );
}

export default memo(Index);
